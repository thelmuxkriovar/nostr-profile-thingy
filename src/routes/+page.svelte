<script lang="ts">
    import { nip19 } from 'nostr-tools';
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    import Profile from '../components/profile.svelte';
    import { profile, relays, pubkey } from "$lib";
    import { SimplePool } from 'nostr-tools/pool';
    import "../app.css";

    const pool = new SimplePool();

    function toHex(npub: string) {
        if (npub.startsWith('npub') || npub.startsWith('nprofile'))
            npub = nip19.decode(npub).data as string;
        return npub;
    } 

    function toNpub(npub: string) {
        if (!npub.startsWith('npub') && !npub.startsWith('nprofile')) npub = nip19.npubEncode(npub);
        return npub;
    }

    async function getProfile(npub: string) {
        console.log(npub)
        const data = await pool.querySync(get(relays), { authors: [npub], kinds: [0] });
        return data.flatMap((evt) => {
            const kind0 = JSON.parse(evt.content);
            if (!kind0.npub) kind0.npub = toNpub(evt.pubkey);
            if (!kind0.pubkey) kind0.pubkey = evt.pubkey;
            return [kind0];
        })[0];
    }

    async function load() {
        relays.set(['wss://relay.snort.social/'])
        pubkey.set(await window.nostr.getPublicKey());
        profile.set(await getProfile(get(pubkey)));
    }

    onMount(() => {
        load();
    })
</script>

<header>
    Nostr Profile
</header>

<Profile />

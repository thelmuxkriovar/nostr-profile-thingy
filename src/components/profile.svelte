<script lang="ts">
	import { profile, relays, pubkey } from '$lib';
	import { SimplePool } from 'nostr-tools/pool';
	import { get } from 'svelte/store';

	const pool = new SimplePool();

	let changingPicture = false;

	async function save() {
		const event = await window.nostr.signEvent({
			kind: 0,
			content: JSON.stringify($profile),
			created_at: Math.ceil(Date.now() / 1000),
			tags: []
		});
		pool.publish(get(relays), event);
	}

	function addField() {
		const name = prompt('Field name');
		if (!name) return;
		if ($profile[name]) {
			if (!confirm(`Field ${name} already exists. Overwrite?`)) return;
		}
		$profile[name] = '';
	}

	function changePicture() {
		changingPicture = true;
	}
</script>

<div class="pic">
	{#if changingPicture}
		<input type="text" bind:value={$profile.picture} />
		<button on:click={() => (changingPicture = false)}>Save</button>
	{:else}
		<img src={$profile.picture} on:click={changePicture} />
	{/if}
</div>

<div class="grid">
	{#each Object.entries($profile) as [key, value]}
		{#if key != 'pubkey' && key != 'npub' && key != 'picture' && key != 'created_at'}
			<div class="card">
				<p>{key}</p>
				<input type="text" bind:value />
			</div>
		{/if}
	{/each}
</div>

<div class="buttons">
	<button on:click={addField}>Add field</button>

	<button on:click={save}>Save</button>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-bottom: 100px;
		padding-left: 200px;
		padding-right: 200px;
	}
	.card {
		padding: 20px;
		padding-bottom: 0;
		border-radius: 50px;
		gap: 5px;
	}
	.card p {
		font-weight: bolder;
		font-size: 20px;
		font-family: 'Roboto', sans-serif;
	}
	input[type='text'] {
		width: 100%;
		border: 0;
		height: 30px;
		padding: 5px;
		box-sizing: border-box;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 15px;
		background: #047a81;
		color: white;
	}

	button {
		background: #00adb5;
		border-radius: 20px;
		color: white;
		border: 2px solid #098f96;
		width: 100%;
		box-sizing: border-box;
		height: 30px;
	}

	button:hover {
		background: #098f96;
	}

	.buttons {
		padding-left: 20px;
		padding-right: 20px;
		box-sizing: border-box;
		display: flex;
		gap: 20px;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #a8eff250;
	}
	img {
		border-radius: 100%;
		max-width: 256px;
	}
	.pic {
		display: flex;
		place-items: center;
		place-content: center;
		margin-top: 50px;
		gap: 40px;
		padding-left: 20px;
		padding-right: 20px;
		box-sizing: border-box;
	}
</style>

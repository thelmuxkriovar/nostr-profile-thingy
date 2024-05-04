import { writable, type Writable } from 'svelte/store';

export const relays = writable([]);
export const pubkey = writable('');
export const profile: Writable<{ [key: string]: any }> = writable({});

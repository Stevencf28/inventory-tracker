export default interface Category {
	id: string; //uuid is the database type, string in typescript
	name: string;
	user_id: string; //uuid is the database type, string in typescript
}

export interface Inventory {
	id: string; //uuid is the database type, string in typescript
	name: string;
	quantity: number;
	cost: number;
	user_id: string; //uuid is the database type, string in typescript
	available: number;
	brand: string;
	category: string;
	created_at: string;
	in_use: number;
}

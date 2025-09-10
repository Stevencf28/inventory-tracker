type UUID = string; //uuid is the database type, string in typescript

export interface Category {
	id: UUID;
	name: string;
	user_id: UUID;
}

export interface Inventory {
	id: UUID;
	date: string;
	name: string;
	quantity: number;
	cost: number;
	user_id: UUID;
	available: number; // available is automatically set by the following formula: quantity - in_use
	brand: string;
	category: Category;
	in_use: number; // default value is 0
}

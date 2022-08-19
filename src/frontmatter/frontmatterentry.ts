export class FrontmatterEntry
{
	private key: string;
	private value: any;

	constructor(key: string, value: any)
	{
		this.key = key;
		this.value = value;
	}

	getKey(): string
	{
		return this.key;
	}

	getValue(): any
	{
		return this.value;
	}

	setValue(value: any): FrontmatterEntry
	{
		this.value = value;
		return this;
	}
}

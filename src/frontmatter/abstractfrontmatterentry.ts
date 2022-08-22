export abstract class AbstractFrontmatterEntry
{
	protected key: string;
	protected value: string|string[];

	constructor(key: string, value: string|string[])
	{
		this.key = key;
		this.value = value;
	}

	public getKey(): string
	{
		return this.key;
	}

	public getValue(): string|string[]
	{
		return this.value;
	}

	public setValue(value: string|string[]): AbstractFrontmatterEntry
	{
		this.value = value;
		return this;
	}
}

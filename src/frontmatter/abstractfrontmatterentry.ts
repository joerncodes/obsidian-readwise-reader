export abstract class AbstractFrontmatterEntry
{
	protected key: string;
	protected value: any;

	constructor(key: string, value: any)
	{
		this.key = key;
		this.value = value;
	}

	public getKey(): string
	{
		return this.key;
	}

	public getValue(): any
	{
		return this.value;
	}

	public setValue(value: any): AbstractFrontmatterEntry
	{
		this.value = value;
		return this;
	}
}

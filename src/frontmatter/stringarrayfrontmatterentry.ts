import {AbstractFrontmatterEntry} from "./abstractfrontmatterentry";

export default class StringArrayFrontmatterEntry extends AbstractFrontmatterEntry
{
	protected value:string[];

	public getValue(): string[] {
		return this.value;
	}

	public setValue(value: string[]): AbstractFrontmatterEntry
	{
		this.value = value;
		return this;
	}
}

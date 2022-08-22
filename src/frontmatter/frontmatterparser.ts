import {AbstractFrontmatterEntry} from "./abstractfrontmatterentry";
import StringArrayFrontmatterEntry from "./stringarrayfrontmatterentry";
import StringFrontmatterEntry from "./stringfrontmatterentry";

export default class FrontmatterParser
{
	private content: string;
	private frontmatter: AbstractFrontmatterEntry[];

	constructor(content: string) {
		this.content = content;
		const startInd = content.indexOf('---') + 4;
		const endInd = content.substring(startInd).indexOf('---') - 1;
		const rawFrontmatter = content.substring(startInd, startInd + endInd);
		this.frontmatter = [];

		if(content.indexOf('---') === -1) {
			return;
		}

		rawFrontmatter.split("\n").forEach(line => {
			const parts = line.split(':').map(v => v.trim());
			const key = parts[0].toString();
			const value = parts.slice(1).join(':');
			this.frontmatter.push(this.createEntry(key, value));
		});
	}

	createEntry(key:string, value:string): AbstractFrontmatterEntry {
		const parsedValue = this.parseValue(value);

		return Array.isArray(parsedValue)
			? new StringArrayFrontmatterEntry(key, parsedValue)
			: new StringFrontmatterEntry(key, parsedValue);
	}

	private parseValue(value: any): any {
		if(Array.isArray(value)) {
			return value;
		}

		let parsedValue:any = value;

		if(value.trim().startsWith('[') && value.trim().endsWith(']')) {
			value = value.slice(1,-1);
			value = value.replace(/\s/g,'');

			parsedValue = value
				? value.split(',')
				: [];
		}

		return parsedValue;
	}

	stripFrontmatter(): string {
		if(this.content.indexOf('---') === - 1) {
			return this.content.trim();
		}

		const startInd = this.content.indexOf('---') + 4;
		const endInd = this.content.substring(startInd).indexOf('---') + 4;

		return this.content.substring(endInd + 4).trim();
		return this.content.substring(this.content.lastIndexOf('---')).trim();
	}

	hasFrontmatter(key: string): boolean {
		let found = false;
		this.frontmatter.forEach(fm => {
			if(fm.getKey() == key) {
				found = true;
			}
		});

		return found;
	}

	getFrontmatter(key: string): AbstractFrontmatterEntry {
		let result = null;
		this.frontmatter.forEach((fm) => {
			if(fm.getKey() == key) {
				result = fm;
			}
		});

		if(result === null) {
			throw new Error('No frontmatter key found for key ' + key);
		}

		return result;
	}

	setFrontmatter(key: string, value: any): FrontmatterParser {
		let found = false;
		this.frontmatter.forEach(fm => {
			if(fm.getKey() == key) {
				fm.setValue(value);
				found = true;
			}
		});

		if (!found) {
			this.frontmatter.push(this.createEntry(key, value));
		}

		return this;
	}

	saveFrontmatter(): string
	{
		let result = '---\n';
		this.frontmatter.forEach(fm => {
			result += Array.isArray(fm.getValue())
				? fm.getKey() + ': [' + fm.getValue().join(', ') + ']\n'
				: fm.getKey() + ': ' + fm.getValue() + '\n';
		});

		// no frontmatter yet
		if(this.content.indexOf('---') === -1) {
			return result + '---\n\n' + this.content;
		}

		return result + this.content.substring(this.content.lastIndexOf('---'));
	}
}

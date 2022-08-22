# Obsidian to Reader

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/joerncodes/obsidian-readwise-reader?style=for-the-badge&sort=semver)](https://github.com/joerncodes/obsidian-readwise-reader/releases/latest)

----

**Important note**: This plugin is still very much **in beta**. There are still bugs I'm trying to work out, so before we go live in the Community Plugin repository, I'd be delighted if you could report any bugs you find. Thank you!

----

An [Obsidian](https://obsidian.md) plugin to send notes to the [readwise.io Reader](https://read.readwise.io) service. Please note that Reader is currently in beta, so in order to use this plugin, your Readwise account must have access to this beta.

## Installation

As this plugin is currently in early development, you can use [BRAT](https://github.com/TfTHacker/obsidian42-brat) to install it. Use the path `joerncodes/obsidian-readwise-reader`.

If you're interested in helping to make *Obsidian to Reader* a finished product, please see [Contributing](#contributing).

## Commands

### *Send to Reader*

The *Send to Reader* command sends the rendered HTML of the current Obsidian note to Reader. It will display a popup message containing the newly created (or recently updated) URL.

### *Open document URL in Reader*

If the `Save Reader URL in frontmatter` is set, this plugin will write the Reader document URL into your Obsidian note's [YAML frontmatter](https://help.obsidian.md/Advanced+topics/YAML+front+matter) upon publishing. Use this command to open a new browser window with your Reader document.

## Settings

<dl>
    <dt>Access token</dt>
    <dd>Your access token for Readwise. You can find yours at <a href="https://readwise.io/access_token">https://readwise.io/access_token</a>.</dd>
    <dt>General tags</dt>
    <dd>Provide a comma separated list of tags, which will be automatically assigned to all Reader documents created with this plugin.</dd>
    <dt>Save Reader URL in frontmatter</dt>
    <dd>If checked, the plugin will write the Reader url for your published document into your Obsidian note's frontmatter.</dd>
    <dt>Fallback author</dt>
    <dd>Provide a string that gets used for the <code>author</code> field in Reader if no author frontmatter is present in your note.</dd>
    <dt>Omit frontmatter</dt>
    <dd>If this is checked, only the note's body will be sent to Reader, without the frontmatter. Defaults to <code>true</code>.</dd>
    <dt>Submit note tags</dt>
    <dd>If this is checked, your Obsidian note's tags (the ones written like <code>#tag</code> plus the ones from the frontmatter) get appended as Reader document tags. See also the <em>General tags</em> setting.</dd>
    <dt>Triage status</dt>
    <dd>Which triage status to submit to Reader. This will tell Reader which "tab" oft he app to show your document in.</dd>
</dl>

## Frontmatter parsing

`Obsidian to Reader` recognizes the following frontmatter keys:

- `author`: Gets used as the author field in your Reader note
- `image-url` and `banner`: Both fields get parsed as an image to send to use as the cover image for your Reader document. If both are present, `image-url` supercedes `banner`.[^1]
- `reader-url`: Gets filled automatically upon publishing if the `Save Reader URL in frontmatter` setting is active
- `summary`: Gets submmited as the Reader document's summary (the text you see in the list page).

## Changelog

You can find the changelog at [https://obsidiantoreader.com/changelog/](https://obsidiantoreader.com/changelog/)

## Contributing

I'm hoping to make *Obsidian to Reader* as awesome as possible, and I need your help to do it. Any issue opened here on GitHub is appreciated, whether it be a bug report or a feature request. 

If you want to take the time to do a PR, those are welcomed with open arms.


## Testing

Tests are written in [Jest](https://jestjs.io) and currently don't have great coverage yet. You can run the tests by executing:

```bash
npm test
```

## Support

Making money is not the goal I had in mind when starting this plugin, but it sure helps! If you are feeling generous, you can [![](https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e11d503cc13747866d338b_Button-2-p-1080.png)](https://ko-fi.com/joerndraws)

-----

#### Footnotes 

[^1]: The reason for this fallback is the excellent [Obsidian Banners](https://github.com/noatpad/obsidian-banners) plugin.

# vim-serie
a plugin to keep track of the shows you watch.



# How to use
Create a file with the `.serie` extension.

## The Format
Empty lines and commented lines are ignored.

Each line is representing a serie.

One serie is descibed by 8 fields (but only two of them are given by you) separated by `;`
```
name; id; season; episode; date; title; [url; urlformat]
```
```
name      : the name of the show
id        : an integer given by the API.
season    : an integer
episode   : an integer
date      : a Date when the episode is not out yet
            or Available or ??? or
            Ended when you arrived at the end
title     : the title of the episode if it is known
url       : calculated from the urlformat
urlformat : a string representing a url
            with {e} and {s} tags where you want
            the episode and season number to be
```



## Add a new serie
In a new line, type the name of a show and then in normal mode `su` (serie update).
It will add under your line some matching names and you can keep the one you want.
Then you can press `su` again on your choosen show to load some details

## Mappings
the mappings are defined in `ftplugin/serie.vim`
I added a mapping in my vimrc to open this file `<leader>es` (edit serie) and it is very convenient.

Also, by default in vim, you can press `gx` on a link to open it in your browser.

### normal mode mappings
	+ `su` : Updates the data (if needed)
	+ `sU` : Updates the first paragraph of the file
	+ `sn` : goes to Next episode
	+ `sp` : goes to Previous episode
	+ `sa` : Align all the columns of the first paragraph


### visual mode mappings
	+ `su` : Updates all Selected lines
	+ `sa` : Align all the columns of the Selected lines

## In case of error:
The programm will gracefully dump the error in your current file.
If you have time before hitting undo, you can yank it and open an issue with the error and some context.



# requirements
You need `vim` and `node` to use it.

You also need an internet connection to get data from the API, but once you fetched some it will be cached under `$HOME/.serie_info` and only updated when needed.

# API used
https://www.episodate.com/api

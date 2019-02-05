if exists("b:current_syntax")
	finish
endif
let b:current_syntax = "serie"
syn match serieComment "#.*$"
hi def link serieComment Comment

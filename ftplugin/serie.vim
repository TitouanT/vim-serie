let s:jscmd = fnamemodify(resolve(expand('<sfile>:p')), ':h:h') . '/serieInfo.js'

exe "nnoremap <silent> sn !!".s:jscmd." --next<CR>"
exe "nnoremap <silent> sp !!".s:jscmd." --previous<CR>"
exe "nnoremap <silent> su !!".s:jscmd." --update<CR>"
exe "nnoremap <silent> sU gg!}".s:jscmd." --update<CR>"

exe "vnoremap <silent> su !".s:jscmd." --update<CR>"
vnoremap <silent> sa  !column -t -o ';' -s ';'<CR>
nnoremap <silent> sa  {!} column -t -o ';' -s ';'<CR>

nmap <silent> so 0/http<cr>gx0:noh<cr>

setlocal nowrap
setlocal cursorline
setlocal commentstring=#\ %s

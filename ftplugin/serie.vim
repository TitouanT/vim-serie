let s:jscmd = fnamemodify(resolve(expand('<sfile>:p')), ':h:h') . '/serieInfo.js'

exe "nnoremap <silent> sn mb!!".s:jscmd." --next<CR>`b"
exe "nnoremap <silent> sp mb!!".s:jscmd." --previous<CR>`b"
exe "nnoremap <silent> su mb!!".s:jscmd." --update<CR>`b"
exe "nnoremap <silent> sU mb{!}".s:jscmd." --update<CR>`b"

exe "vnoremap <silent> su !".s:jscmd." --update<CR>"
vnoremap <silent> sa  !column -t -o ';' -s ';'<CR>
nnoremap <silent> sa  mb{!} column -t -o ';' -s ';'<CR>`b

nmap <silent> so mb0/http<cr>gx0:noh<cr>`b

setlocal nowrap
setlocal cursorline
setlocal commentstring=#\ %s

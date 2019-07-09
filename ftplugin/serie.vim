let s:jscmd = fnamemodify(resolve(expand('<sfile>:p')), ':h:h') . '/serieInfo.js'

exe "nnoremap <silent> sn mb!!".s:jscmd." --next<CR>`b"
exe "nnoremap <silent> sp mb!!".s:jscmd." --previous<CR>`b"
exe "nnoremap <silent> su mb!!".s:jscmd." --update<CR>`b"
exe "nnoremap <silent> sU mbvip!".s:jscmd." --update<CR>`b"

exe "vnoremap <silent> su !".s:jscmd." --update<CR>"
vnoremap <silent> sa  :s: *;: ;:g<cr>:noh<cr>:'<,'>!column -t -o ';' -s ';'<CR>
nnoremap <silent> sa  mbvip:s: *;: ;:g<cr>:'<,'>!column -t -o ';' -s ';'<CR>`b:noh<cr>

nmap <silent> so mb0/http<cr>gx0:noh<cr>`b

setlocal nowrap
setlocal cursorline
setlocal commentstring=#\ %s

### sublime-sass-buider 0.0.2 ###
1. 本插件实质是一个sublime build system，作用是编译sass，并经过autoprefixer处理，且生成sourcemap；
2. 需要安装node，且全局安装node-sass（本地安装node-sass太大，而且libsass下载太慢）；
3. git clone到本地后，运行npm install，安装依赖组件；
4. 直接把文件夹扔到 Sublime Text 3\Data\Packages 目录（可先删掉 .git）；
5. 建议sublime安装 SublimeOnSaveBuild 插件，可在保存时自动编译sass；
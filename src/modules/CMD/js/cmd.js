// Connecting to the backend via socket
const cmdSocket = io.connect('http://localhost');

$("#console-window").on("click", (e) => {
    $("#console-input").focus();
})

$("#console-input").keydown(function(key){
    // Enter key check
    if(key.keyCode === 13){
        console.log(this.value);
        $(this).attr("readonly");
        cmdSocket.emit("COMMAND_GIVEN", {command: this.value});
        this.value = "";
    }
})

cmdSocket.on("COMMAND_FINISHED", (data) => {
    console.log("Finished");
    $("#console-input").removeAttr("readonly");
    console.log(data.path)
    $("#console-directory").html(data.path + ">");
});
cmdSocket.on("COMMAND_ERROR", (data) => {
    $("#console-window").prepend(`<p class="command-error">${data}</p>`);
});
cmdSocket.on("COMMAND_STDOUT", (data) => {
    console.log(data);
    // TODO -> Split, flip, THEN iterate
    data.split("\n").forEach( line => {
        line = line.replace("<","&lt;");
        line = line.replace(">","&gt;");
        console.log(line.replace(/ +(?= )/g,''));
        $("#console-window").prepend(`<pre class="command-stdout">${line.replace(/ +(?= )/g,'\t')}</pre>`);
    });
});
cmdSocket.on("COMMAND_STDERR", (data) => {
    $("#console-window").prepend(`<p class="command-stderr">${data}</p>`);
    
});
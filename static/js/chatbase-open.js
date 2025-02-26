window.addEventListener('load', function() {
  setTimeout(function() {
    if (window.chatbase) {
      console.log("error")
      window.chatbase.open();
    }
  }, 1000); // 1000 milliseconds = 1 second delay
});
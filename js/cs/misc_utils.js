
//General js tools
{
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    Array.prototype.contains = function(obj) {
      var i = this.length;
      while (i--) {
          if (this[i] === obj) {
              return true;
          }
      }
      return false;
    };
    
    String.prototype.replaceBetween = function(start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
    };
    }
    
    function msgBG(msg = null){
      let message = msg == null ? {type:"query", query_type: "update"} : msg
      chrome.runtime.sendMessage(message);
      //console.log("messaging BG", message)
    }
    
function copy2clipboard() {
    /* Get the text field */
    var copyText = document.getElementById("formalizedText");
  
    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
    
    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
  }
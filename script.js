


window.addEventListener("load",()=>{
    console.log("load")


    let lessOneDayYes = document.getElementById("lessonedayyes") ;
    let lessOneDayNo = document.getElementById("lessonedayno") ;
    let oneDayMissingCol = document.getElementById("onedaymissingcol");
    let severalDayMissingCol = document.getElementById("severaldaymissing");

    lessOneDayYes.addEventListener("click",()=>{
        if (lessOneDayYes.checked){
            oneDayMissingCol.classList.remove("d-none");
            severalDayMissingCol.classList.add("d-none")
        }
    })

    lessOneDayNo.addEventListener("click",()=>{
        if (lessOneDayNo.checked){
            oneDayMissingCol.classList.add("d-none");
            severalDayMissingCol.classList.remove("d-none")
        }
    })

    Swal.fire({
        title: "The Internet?",
        text: "That thing is still around?",
        icon: "question"
      });
})
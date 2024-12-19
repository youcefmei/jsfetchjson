


function displayObj(el, obj) {

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    obj.groups.forEach(group => {
        let divRoot = document.createElement("div")
        let labelCode = document.createElement("label")
        labelCode.className = "py-1"
        let codeText = "Code "
        let div = document.createElement("div")
        group.codes.forEach(code => {
            codeText = codeText + zeroPad(code.code_id, 2) + " - "
            code.reasons.forEach(reason => {
                let divReason = document.createElement("div")
                divReason.className = "d-flex my-1 ms-3"

                let radio = document.createElement("input")
                radio.setAttribute("type", "radio")
                radio.setAttribute("name", "missingreason")
                radio.setAttribute("value", `${group.group_id}-${code.code_id}`)
                radio.setAttribute("id", `missingreason-${reason.reason_id}`)
                radio.className = "me-2 form-check-input"

                let labelReason = document.createElement("label")
                labelReason.setAttribute("for", `missingreason-${reason.reason_id}`)

                if (reason.permit_day) {
                    labelReason.innerHTML = reason.permit_day > 1 ? reason.reason_name + ` ( ${reason.permit_day} jours)` : reason.reason_name + ` ( ${reason.permit_day} jour)`
                } else {
                    labelReason.innerHTML = reason.reason_name
                }
                divReason.appendChild(radio)
                divReason.appendChild(labelReason)

                div.appendChild(divReason)
            })
        })
        labelCode.innerHTML = codeText.slice(0, -3) + ": " + group.group_name
        divRoot.appendChild(labelCode)
        divRoot.appendChild(div)
        el.appendChild(divRoot)

    });
}


function displayName() {
    let lastName = document.getElementById("lastname");
    let firstName = document.getElementById("firstname");
    let nameMissing = document.getElementById("namemissing");
    nameMissing.innerHTML = lastName.value + " " + firstName.value


}


window.addEventListener("load", () => {
    console.log("load")
    let lessOneDayYes = document.getElementById("lessonedayyes");
    let lessOneDayNo = document.getElementById("lessonedayno");
    let oneDayMissingCol = document.getElementById("onedaymissingcol");
    let severalDayMissingCol = document.getElementById("severaldaymissing");
    let radioTab = document.getElementById("tab");
    let lastName = document.getElementById("lastname");
    let firstName = document.getElementById("firstname");
    let nameMissing = document.getElementById("namemissing");

    let missingDay = document.getElementById("missingday");
    let beginHourMissingDay = document.getElementById("beginhourmissingday");
    let finishHourMissingDay = document.getElementById("finishhourmissingday");
    let beginMissingPeriod = document.getElementById("beginmissingperiod");
    let endMissingPeriod = document.getElementById("endmissingperiod");


    firstName.addEventListener("change", displayName)
    lastName.addEventListener("change", displayName)


    lessOneDayYes.addEventListener("click", () => {
        if (lessOneDayYes.checked) {
            oneDayMissingCol.classList.remove("d-none");
            severalDayMissingCol.classList.add("d-none")
            beginMissingPeriod.value = ""
            endMissingPeriod.value = ""
        }
    })

    lessOneDayNo.addEventListener("click", () => {
        if (lessOneDayNo.checked) {
            oneDayMissingCol.classList.add("d-none");
            severalDayMissingCol.classList.remove("d-none")
            missingDay.value = ""
            beginHourMissingDay.value = ""
            finishHourMissingDay.value = ""
        }
    })


    let motif = fetch("https://raw.githubusercontent.com/youcefmei/jsfetchjson/refs/heads/main/absencemotif.json").then((r) => {
        return r.json()
    }).then((motif) => {
        console.log(motif["groups"])
        displayObj(radioTab, motif)
    }
    )
    console.log(motif)

    let form = document.getElementById("form-absence");
    // create the pristine instance
    let pristine = new Pristine(form);


    // A validator to check if the Date is after present or futur
    pristine.addValidator(missingDay, function (value) {
        // here `this` refers to the respective input element
        let now = new Date();
        let today = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`);
        let dayMiss = new Date(value)
        if (dayMiss >= today) {
            console.log("valid")
            return true;
        }
        console.log("invalid")
        return false;
    }, "La date ne peut pas etre antérieur à aujourd'hui", 2, false);


    pristine.addValidator(beginHourMissingDay, function (value) {
        if (value.indexOf(":") >= 0) {
            let hours = parseInt(value.split(":")[0])
            if ((hours >= 8) && (hours <= 17)) {
                return true
            }
        }
        return false;
    }, "L'heure n'est pas valide", 2, false)


    pristine.addValidator(finishHourMissingDay, function (value) {
        if (value.indexOf(":") >= 0) {
            let hoursBegin = parseInt(beginHourMissingDay.value.split(":")[0])
            let hoursEnd = parseInt(value.split(":")[0])
            if ((hoursEnd >= 8) && (hoursEnd <= 17) && (hoursBegin < hoursEnd)) {
                return true
            }
        }
        return false;
    }, "L'heure n'est pas valide", 2, false)




    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // check if the form is valid
        let valid = pristine.validate(); // returns true or false
        console.log(valid)

    });
    // Swal.fire({
    //     title: "The Internet?",
    //     text: "That thing is still around?",
    //     icon: "question"
    // });
})
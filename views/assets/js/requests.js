$(document).ready(function () {
    var voornaam, achternaam, email, gebruikersnaam, paswoord;
    $('#registerform').on('submit', function (e) {
        console.log("REGISTERFORM WAS SUBMITTED")
        e.preventDefault();
        voornaam = $("#voornaam").val();
        achternaam = $("#achternaam").val();
        email = $("#email").val();
        gebruikersnaam = $("#gebruikersnaam").val();
        paswoord = $("#paswoord").val();
        if (!voornaam) {
            console.log("Missing Voornaam")
            changecolor("#voornaam", 1000)
        } else if (!achternaam) {
            console.log("Missing Achternaam")
            changecolor("#achternaam", 1000)
        }
        else if (!email) {
            console.log("Missing email")
            changecolor("#email", 1000)
        }
        else if (!gebruikersnaam) {
            console.log("Missing Gebruikersnaam")
            changecolor("#gebruikersnaam", 1000)
        }
        else if (!paswoord) {
            console.log("Missing Paswoord")
            changecolor("#paswoord", 1000);
        }
        else {

            $.post("/new_user", { voornaam: voornaam, achternaam: achternaam, email: email, gebruikersnaam: gebruikersnaam, paswoord: paswoord }, function (data) {
                console.log(data)
                if (data = "OK") {
                    $.notify({
                        icon: 'ti-save',
                        message: "You are now registered"
                    }, {
                        type: 'success',
                        timer: 4000
                    });
                }
            });
        }
    });

    async function changecolor(element, timeout) {
        $(element).css({ "background-color": "red" });
        setTimeout(() => {
            $(element).css({ "background-color": "#fffcf5" });
        }, timeout);
    }



    $('#loginform').on('submit', function (e) {
        console.log("LOGINFORM WAS SUBMITTED")
        e.preventDefault();
        var gebruikersnaam, paswoord;
        gebruikersnaam = $("#gebruikersnaam").val();
        paswoord = $("#paswoord").val();

        $.post("/login", { gebruikersnaam: gebruikersnaam, paswoord: paswoord }, function (data, statusText, xhr) {
            var status = xhr.status;
            console.log(status, statusText)
            if (status = "200") {
                window.location.href = "/dashboard.html";
                $.notify({
                    icon: 'ti-save',
                    message: "You are now Logged in"
                }, {
                    type: 'success',
                    timer: 4000
                });
            } else {
                $.notify({
                    icon: 'ti-alert',
                    message: "This user does not exist, or the data you entered was wrong!"
                }, {
                    type: 'danger',
                    timer: 4000
                });

            }
        });

    })

    
});

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


function LoadUserDetails() {
    $.get("/getUserInfo", { id:getCookie("Login"), token:getCookie("Token") }, function (data, statusText, xhr) {
        var status = xhr.status;
        console.log(status, statusText)
        console.log(data)
    });

}

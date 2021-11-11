class Training {
    constructor(pace, km, type) {
        this.pace = pace;
        this.km = km;
        this.type = type;
    }

    getText() {
        let text = `${this.km} км в темпі ${this.pace}`;
        return text;
    }
}

class FastTraining extends Training {
    constructor(pace, km, type, warmup, cooldown, numberOfReps, recoveryKm) {
        super(pace, km, type);
        this.warmup = warmup;
        this.cooldown = cooldown;
        this.numberOfReps = numberOfReps;
        this.recoveryKm = recoveryKm;
    }

    getText() {
        let text = `${this.warmup} км розминка, ${this.numberOfReps} по ${this.km} м в темпі ${this.pace} через ${this.recoveryKm} м відновлення, ${this.cooldown} км заминка`;
        return text;
    }
}


class TrainingPlan {
    constructor(user) {
        this.user = user;
    }
    static easy = "Відновлююче";
    static threshold = "Порогове";
    static long = "Довге";
    static interval = "Інтервальне";
    static repeat = "Прискорення";
    count() {
        if (this.user.numberOfTrainings === 3) {
            this.tuesday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.27), TrainingPlan.easy);
            this.thursday = new FastTraining(this.user.thresholdPace, Math.round(this.user.mileage * 50), TrainingPlan.threshold, Math.round(this.user.mileage * 0.1), Math.round(this.user.mileage * 0.06), 3, Math.round(this.user.mileage * 10));
            this.sunday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.4), TrainingPlan.long);
        } else if (this.user.numberOfTrainings === 4) {
            this.monday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.17), TrainingPlan.easy);
            this.wednesday = new FastTraining(this.user.intervalPace, Math.round(this.user.mileage * 20), TrainingPlan.interval, Math.round(this.user.mileage * 0.1), Math.round(this.user.mileage * 0.06), 6, Math.round(this.user.mileage * 10));
            this.friday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.17), TrainingPlan.easy);
            this.sunday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.33), TrainingPlan.long);
        } else if (this.user.numberOfTrainings === 5) {
            this.monday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.14), TrainingPlan.easy);
            this.tuesday = new FastTraining(this.user.repeatPace, Math.round(this.user.mileage * 10), TrainingPlan.repeat, Math.round(this.user.mileage * 0.06), Math.round(this.user.mileage * 0.02), 5, Math.round(this.user.mileage * 10));
            this.wednesday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.14), TrainingPlan.easy);
            this.friday = new FastTraining(this.user.intervalPace, Math.round(this.user.mileage * 20), TrainingPlan.interval, Math.round(this.user.mileage * 0.07), Math.round(this.user.mileage * 0.02), 5, Math.round(this.user.mileage * 10));
            this.saturday = new Training(this.user.easyPace, Math.round(this.user.mileage * 0.32), TrainingPlan.long);
        }
    }
}

// function setUserPlan() {
//     let user = JSON.parse(window.localStorage.getItem('user'));
//     let plan = new 
// };


let button = document.querySelector("#generate");
button.addEventListener('click', () => {
    $.ajax({
        type: "PUT",
        url: "http://low-pulse.eu-central-1.elasticbeanstalk.com/runner",
        data: {
            id: document.location.search.substring(document.location.search.indexOf("=") + 1),
            mileage: $('#mileage-select').val(),
            numberOfTrainings: $('#days-select').val()
        },
        success: function(data) {
            let user = data;
            console.log(user);
            let userPlan = new TrainingPlan(user);
            userPlan.count();
            console.log(userPlan);
            document.querySelector(".plan-table").style.visibility = "visible";
            placeTraining(userPlan);
        }

    });
})




// let userOne = {
//     easyPace: "6:00",
//     thresholdPace: "5:00",
//     mileage: "30",
//     numberOfTrainings: 3
// }

// let userOnePlan = new TrainingPlan(userOne);
// userOnePlan.count();
// console.log(userOnePlan.tuesday.getText());
// console.log(userOnePlan.thursday.getText());
// console.log(userOnePlan.sunday.getText());

// let long = new Training('5:50-6:00', 15, 'Довга');
// console.log(long.type);
// console.log(long.getText())

function placeTraining(plan) {
    let week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (let i = 0; i < week.length; i++) {
        if (plan[week[i]] === undefined) {
            document.querySelector(`#${week[i]} .tr-type`).innerHTML = "Відпочинок";
            document.querySelector(`#${week[i]} .tr-content`).innerHTML = "";
        } else {
            document.querySelector(`#${week[i]} .tr-type`).innerHTML = plan[week[i]].type;
            document.querySelector(`#${week[i]} .tr-content`).innerHTML = plan[week[i]].getText();
        }
    }
}
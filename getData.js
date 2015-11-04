var exportArr = 
	
		
[
/*
{
	  "user_type" : "Driver",
	  "user_id" : "10",
	  "name": "Noa Ben Driver",
	  "date": "17/11/15",
	  "time": "12:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "noa_ben@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	   "is_selected" : false 
	},
	{
	  "user_type" : "passenger",
	  "user_id" : "1",
	  "name": "Noa Ben",
	  "date": "17/11/15",
	  "time": "12:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "noa_ben@mail.com",
	  "status_match": true,
	  "is_in_db":true,
	  "is_selected" : false 
	},
	{
	  "user_type" : "Driver",
	  "user_id": "2",
	  "name": "Miki Lev",
	  "date": "12/11/15",
	  "time": "10:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false
	},
	{
	  "user_type" : "Driver",
	  "user_id": "2",
	  "name": "Miki Lev",
	  "date": "15/11/15",
	  "time": "15:00:00",
	  "source": "HEIFA",
	  "destination": "Tel-Aviv",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false
	},
	{
	  "user_type" : "Driver",
	  "user_id": "2",
	  "name": "Miki Lev",
	  "date": "4/11/15",
	  "time": "08:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false
	},
	{
	  "user_type" : "passenger",
	  "user_id": "3",
	  "name": "Hen Shemesh",
	  "date": "2/11/15",
	  "time": "13:00:00",
	  "source": "HEIFA",
	  "destination": "TEL AVIV",
	  "mail" : "HEN111@mail.com",
	  "status_match": true,
	  "is_in_db":true,
	  "is_selected" : false
	},
	{
	  "user_type" : "Driver",
	  "user_id": "4",
	  "name": "danna jen",
	  "date": "3/11/15",
	  "time": "11:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "danna555@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false
	},
	{
	  "user_type" : "passenger",
	  "user_id": "5",
	  "name": "Miki Lev",
	  "date": "2/11/15",
	  "time": "10:00:00",
	  "source": "Tel-Aviv",
	  "destination": "HAIFA",
	  "mail" : "miki.lev@mail.com",
	  "status_match": false,
	  "is_in_db":true,
	  "is_selected" : false

	}
	*/
]; 


module.exports = {
		GetData:function ()
		{
			return exportArr;
		}
		,
		GetDataOfRides:function(name, source ,destination, date , time) {
			console.log("in get data of rides ", name, source ,destination, date , time);
			var retArr = [];
			for (i=0;i<exportArr.length;i++) {
				if (exportArr[i].user_type == "Driver" 
					&& 
					(exportArr[i].name == name ||
					 (exportArr[i].source == source &&
					 exportArr[i].destination == destination &&
					 exportArr[i].date == date &&
					 exportArr[i].time == time )
					 	)){ 
					retArr.push(exportArr[i]);
console.log("pushing of rides ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);
				} else{
					console.log("not pushing of rides ", exportArr[i].name, exportArr[i].source ,exportArr[i].destination, exportArr[i].date , exportArr[i].time);

				}
			}
			return retArr;

		}
		,
		pushData:function (trempItem)
		{
			exportArr.push(trempItem);
		}
}
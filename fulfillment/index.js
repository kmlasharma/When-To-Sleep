// Copyright 2019, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const {dialogflow, 
  MediaObject,
  Suggestions} = require('actions-on-google');
const functions = require('firebase-functions');
const cycle = 90
const cyclesInMins = [(90 * 6) + 15, (90 * 5) + 15, (90 * 4) + 15]
const moment = require('moment');
const app = dialogflow({debug: true});

app.intent('Default Welcome Intent', (conv) => {
  conv.ask("What time do you want to wake up at?");
});

app.intent('ReceivedTime', (conv, {time}) => {
  time = time.split("+")[0];
  let result = calculateTimesToSleepAt(time);
  console.log(result);
  conv.close(`Your best bet is to go to sleep at ${result[0]} for 
6 sleep cycles, otherwise ${result[1]} for 5 or ${result[2]} for 4.`);
});

function calculateTimesToSleepAt(time) {
  let timeToWakeAt = moment(time).format("HH:mm");
  let result = [];
  for (let i = 0; i < cyclesInMins.length; i++) {
    let timeToSleep = moment(timeToWakeAt, "HH:mm").subtract(cyclesInMins[i], "minutes");
    result.push(timeToSleep.format("HH:mm"));
  }
  return result;
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

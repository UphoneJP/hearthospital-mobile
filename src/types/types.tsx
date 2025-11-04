/* eslint-disable @typescript-eslint/no-explicit-any */
interface pointType {
  reward: number,
  madeAt: Date,
  gettingFrom: string,
  _id: string
}
interface userType {
  _id: string,
  googleId: string,
  appleUserId: string,
  username: string,
  penName: string,
  email: string,
  promotion: string,
  notify: boolean,
  reviews?: reviewType[],
  responses?: responseType[],
  favorites?: reviewType[],
  forResetToken: string,
  forResetExpires: Date,
  isDeleted : boolean,
  num: number,
  points: pointType[],
  timeOfGotPoint: Date
}
interface hospitalType {
  _id: string,
  hospitalname : string,
  location : string,
  area: string,
  lat : number,
  lng : number,
  url: string,
  R3DPC: string,
  R3Kcode: object,
  R3DPCcode: object,
  R4DPC: string,
  R4Kcode: object,
  R4DPCcode: object,
  R5DPC: string,
  R5Kcode: object,
  R5DPCcode: object,
  R6DPC: string,
  R6Kcode: object,
  R6DPCcode: object,
  reviews? : reviewType[],
  [key: string]: any
}
interface reviewType {
  _id: string,
  hospital? : hospitalType,
  title : string,
  diseaseNames : string[],
  treatmentTiming: string,
  comment : string,
  url : string,
  author? : userType,
  tweetDate: string,
  ownerCheck : boolean,
  goodPushedUser?: userType[],
  responses?: responseType[]
}
interface responseType {
  _id: string,
  hospital?: hospitalType,
  review? : reviewType,
  comment : string,
  author? : userType,
  responseDate: string,
  ownerCheck : boolean,
  goodPushedUser?: userType[]
}

interface talkThemeType {
_id: string,
author: string,
title: string,
detail: string,
talks?: talkType[],
colorNum: number,
touchAt: Date,
accessCount: number
}

interface talkType {
_id: string,
loggedInUser?: userType,
guestName?: string,
content: string,
madeAt: Date,
deleted: boolean
}

type KcodeType = {
K5541: string,
K5551: string,
K5601ﾊ: string,
K563: string,
K566: string,
K5702: string,
K5741: string,
K5761: string,
K5762: string,
K5801: string,
K5812: string,
K5861: string,
K5862: string,
K5972: string,
'K604-24': string,
K6171: string
}

type contactPersonType = {
  _id: string,
  penName: string
}

type messageType = {
  _id: string
  sender: string,
  reciever: string,
  content: string,
  timestamp: Date,
  shown: boolean,
}

type usersExceptContactPersonsType = {
  _id: string,
  penName: string
}


export { pointType, userType, hospitalType, reviewType, responseType, talkThemeType, talkType, KcodeType, contactPersonType, messageType, usersExceptContactPersonsType }

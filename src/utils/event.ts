import { Events } from '@tarojs/taro'

class Event {
  static eventList: any = null
  static get EventList() {
    if (this.eventList) {
      return this.eventList
    }
    this.eventList = new Events()
    return this.eventList
  }
}

export default Event.EventList

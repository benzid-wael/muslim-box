import React from "react";
import { mount, shallow } from "enzyme";
import assert from "assert";
import timezoneMock from "timezone-mock";

import PrayerTime from "./PrayerTime.react";

describe("<PrayerTime />", () => {
  const startTimestamp = 1658326500; // 2022-07-20T14:17:00.000Z
  const secondsInOneHour = 3600;
  const endTimestamp = startTimestamp + secondsInOneHour;
  const prayer: PrayerTime = {
    name: "Fajr",
    isPrayer: true,
    start: startTimestamp,
    end: endTimestamp,
    visible: true,
  };

  beforeAll(() => {
    timezoneMock.register("UTC");
  });

  afterAll(() => {
    timezoneMock.unregister();
  });

  beforeEach(() => {
    // We are setting the current time to 17m before end time
    Date.now = jest.fn(() => new Date("2022-07-20T15:00:00.000Z"));
  });

  it("<PrayerTime /> when prayer is not active", () => {
    const container = shallow(<PrayerTime prayer={prayer} />);
    expect(container.html()).toMatchSnapshot();
  });

  it("<PrayerTime /> when prayer is active", () => {
    const container = shallow(<PrayerTime prayer={prayer} isCurrent={true} />);
    expect(container.html()).toMatchSnapshot();
  });

  it("<PrayerTime /> when reminder is active", () => {
    // to activate the reminder, we need to set endTimeReminderInMinutes
    // to more than 17m as it remains only 17m till the prayer end time
    // (check start, end and mocked current time)
    const container = shallow(<PrayerTime prayer={prayer} isCurrent={true} endTimeReminderInMinutes={20} />);
    expect(container.html()).toMatchSnapshot();
  });
});

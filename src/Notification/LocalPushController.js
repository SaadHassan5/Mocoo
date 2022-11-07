import notifee from "@notifee/react-native";
export const LocalNotifee = async(title,body,data={})=> {
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
        title: title,
        body: body,
        data:data,
        android: {
            channelId,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
        },
    });
}

export async function cancel(notificationId) {
    await notifee.cancelNotification(notificationId);
  }
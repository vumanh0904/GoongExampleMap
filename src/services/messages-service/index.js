import {Alert} from 'react-native';

export default class MessagesService {
  ConfirmService = (msg, title, approve, cancel, handleOK) => {
    Alert.alert(
      title,
      msg,
      [
        {text: cancel, onPress: () => console.log('Cancel Pressed')},
        {text: approve, onPress: () => handleOK()},
      ],
      {cancelable: false},
    );
  };

  NoticeService = (msg, title, confirm) => {
    Alert.alert(
      title,
      msg,
      [{text: confirm, onPress: () => console.log('Notice Pressed')}],
      {cancelable: false},
    );
  };

  ComfirmNoticeService = (msg, title, confirm, handleOK) => {
    Alert.alert(title, msg, [{text: confirm, onPress: () => handleOK()}], {
      cancelable: false,
    });
  };

  NoticeServiceWithTextInput(msg, title, handleOK, handleCancel) {
    Alert.prompt(
      title,
      msg,
      [
        {
          text: 'キャンセル',
          onPress: () =>
            handleCancel ? handleCancel() : console.log('cancel'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: text => handleOK(text),
        },
      ],
      'secure-text',
    );
  }
}

export const messagesService = new MessagesService();

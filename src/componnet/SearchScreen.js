// // /**
// //  * Sample React Native App
// //  * https://github.com/facebook/react-native
// //  *
// //  * @format
// //  * @flow strict-local
// //  */

// import React, {useState, useEffect, Fragment, useMemo} from 'react';
// import {Platform} from 'react-native';
// import {
//   StyleSheet,
//   View,
//   Text,
//   Image,
//   TouchableHighlight,
//   BackHandler,
//   TouchableOpacity,
//   TextInput,
// } from 'react-native';
// import {
//   SafeAreaInsetsContext,
//   SafeAreaView,
// } from 'react-native-safe-area-context';
// import {SwipeListView} from 'react-native-swipe-list-view';
// import {
//   Stepper,
//   Badge,
//   Modal,
//   Button,
//   Provider,
// } from '@ant-design/react-native';

// import {Icon, SearchBar} from 'react-native-elements';
// import {Colors, Fonts, Helpers, Metrics} from '../../theme';
// import ListItemAPI from '../../core/api/ListItemAPI';
// import GeneralStatusBar from '../../config/generalStatusBar/GeneralStatusBar';
// import * as utils from '../../config/config/config';
// import {useSelector} from 'react-redux';
// import {useFocusEffect} from '@react-navigation/native';
// import AsyncStorage from '@react-native-community/async-storage';
// import ViewOrderAPI from '../../core/api/ViewOrderAPI';
// import SearchAPI from '../../core/api/SearchAPI';
// import i18n from '../../i18n/i18n';

// const SearchScreen = ({navigation, route}) => {
//   const res = route.params;
//   const loginReducer = useSelector(state => state.user);

//   const [listItem, setListitem] = useState([]);
//   const [quantity, setQuantity] = useState([]);

//   const [isAddGuide, setAddGuide] = useState(false);
//   const [isAddQty, setAddQty] = useState(false);
//   const [indexAdd, setIndexAdd] = useState();
//   const [indexGuide, setIndexGuide] = useState();
//   const [guide, setGuide] = useState([]);
//   const [listParams, setlistParams] = useState([]);

//   const [selectItem, setSelectItem] = useState([]);
//   const [listSelected, setListSelected] = useState([]);

//   const [dataAddQty, setDataAddQty] = useState([]);

//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     getListItem();
//     getShowCheck();
//   }, [res]);

//   useFocusEffect(
//     React.useCallback(() => {
//       getListItem();
//       getShowCheck();
//       getTotalAmount();
//       getViewOder();
//     }, [res]),
//   );

//   useEffect(() => {
//     const handleBack = () => {
//       navigation.goBack();
//       return true;
//     };
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       handleBack,
//     );

//     return () => backHandler.remove();
//   }, []);

//   const getShowCheck = async () => {
//     const checkRVC = res.res.type || res.res.rvc || res.res.rvc;
//     const checkNo =
//       res.res.params ||
//       res.res.responseJson ||
//       res.res.openNew ||
//       res.res.res.params;
//     let showCheck = await ListItemAPI.getShowCheck({checkRVC, checkNo});
//     setMyOpenID(showCheck);
//   };

//   const getListItem = async () => {
//     const CleckID = loginReducer.Initial;
//     const userLog = await AsyncStorage.getItem('activeLogin');
//     const gClerkID = CleckID || userLog;
//     const checkRVC =
//       res.res.type || res.res.rvc || res.res.openNew || res.res.res.params;
//     let tempListItem = await SearchAPI.getAllItem({gClerkID, checkRVC});
//     setListitem(tempListItem);
//     setQuantity([...Array(tempListItem.length).keys()].map(() => 1));
//     setGuide([...Array(tempListItem.length).keys()].map(() => ''));
//   };

//   const getViewOder = async () => {
//     const checkNo =
//       res.res.params ||
//       res.res.responseJson ||
//       res.res.openNew ||
//       res.res.res.params;
//     const rvc = res.res.type || res.res.rvc;
//     let listItemSelected = await ViewOrderAPI.getViewOrder({checkNo, rvc});
//     let temp = [];
//     listItemSelected.forEach(element => {
//       temp.push(element.itemCode);
//     });
//     setListSelected(temp);
//   };

//   const getTotalAmount = async () => {
//     const link =
//       res.res.params ||
//       res.res.responseJson ||
//       res.res.openNew ||
//       res.res.res.params;
//     let Amount = await ListItemAPI.getTotalAmount(link);
//     setTotal(Amount);
//   };

//   const handlePostInsertItem = async () => {
//     const PostItem = await ListItemAPI.postInsertItem(listParams);
//     if (PostItem === 'ok') {
//       navigation.navigate('ViewOrderScreen', {
//         params: listParams[0].myCheckNo,
//         rvc: listParams[0].gRVCNo,
//       });
//     } else {
//       console.error();
//     }
//   };

//   const _onBackPress = navigation => {
//     navigation.goBack();
//   };
//   const addQuantity = data => {
//     setAddQty(true);
//     setIndexAdd(data.index);
//     setDataAddQty(data);
//   };

//   const _onModalAddQty = () => {
//     setAddQty(false);
//     _onSetParam(dataAddQty);
//   };

//   const addCookingGuide = data => {
//     setAddGuide(true);
//     setIndexGuide(data.index);
//   };

//   const _onModaladdGuide = () => {
//     setAddGuide(false);
//   };

//   const updateQTY = (value, index) => {
//     if (value === 0 || value === '') {
//       setQuantity(prev => {
//         prev[index] = 1;
//         return [...prev];
//       });
//     } else {
//       setQuantity(prev => {
//         prev[index] = value;
//         return [...prev];
//       });
//     }
//   };

//   const _onClickDelete = async data => {
//     const cleckID = loginReducer.Initial;
//     const userLog = await AsyncStorage.getItem('activeLogin');
//     const item = data.item.iCode;
//     const newData = [...selectItem];
//     const index = newData.indexOf(item);
//     newData.splice(index, 1);
//     setSelectItem(newData);
//     const itemParam = {
//       myCheckNo: `${
//         res.res.params ||
//         res.res.responseJson ||
//         res.res.openNew ||
//         res.res.res.params
//       }`,
//       iQty: `${quantity[data.index]}`,
//       icode: data.item.iCode,
//       itemName: data.item.iname,
//       iPrice: `${data.item.price}`,
//       lGuide: guide[data.index],
//       gNo: '1',
//       menuNum: res.item.menuNumber,
//       gRVCNo: data.item.rvc,
//       gClerkID: userLog || cleckID,
//     };
//     const newParam = [...listParams];
//     const index2 = newParam.indexOf(itemParam);
//     newParam.splice(index2, 1);
//     setlistParams(newParam);
//   };

//   const _onSetParam = async data => {
//     setSelectItem(prev => [...prev, data.item.iCode]);
//     const cleckID = loginReducer.Initial;
//     const userLog = await AsyncStorage.getItem('activeLogin');
//     setlistParams(prev => [
//       ...prev,
//       {
//         myCheckNo: `${
//           res.res.params ||
//           res.res.responseJson ||
//           res.res.openNew ||
//           res.res.res.params
//         }`,
//         iQty: `${quantity[data.index]}`,
//         icode: data.item.iCode,
//         itemName: data.item.iname,
//         iPrice: `${data.item.price}`,
//         lGuide: guide[data.index],
//         gNo: '1',
//         menuNum: res.item.menuNumber,
//         gRVCNo: data.item.rvc,
//         gClerkID: userLog || cleckID,
//       },
//     ]);
//   };

//   const renderHeader = () => {
//     return (
//       <View style={{...styles.toolbar}}>
//         <TouchableOpacity
//           hitSlop={styles.hitSlop}
//           onPress={() => {
//             _onBackPress(navigation);
//           }}>
//           <Image
//             source={require('../../assets/icon/left-arrow.png')}
//             style={styles.iconback}
//           />
//         </TouchableOpacity>
//         <Text style={{...styles.toolbarTitle}}>
//           {i18n.t('listItem.search')}
//         </Text>
//         <View></View>
//       </View>
//     );
//   };

//   const renderItem = data => {
//     const itemBackgroudBold = [...selectItem, ...listSelected];
//     return (
//       <TouchableHighlight
//         onPress={() => _onSetParam(data)}
//         style={[
//           styles.rowFront,
//           itemBackgroudBold.map(ele =>
//             ele === data.item.iCode ? styles.backgroundSelected : null,
//           ),
//         ]}
//         underlayColor={'#AAA'}>
//         <View style={styles.renderItem}>
//           <Image
//             source={require('../../assets/images/attach.png')}
//             style={styles.imageItem}
//           />
//           <View style={{flexDirection: 'column', flex: 0.6}}>
//             <Text
//               style={{
//                 paddingTop: Metrics.normal,
//                 fontWeight: 'bold',
//                 textAlign: 'left',
//               }}>
//               {data.item.iname}
//             </Text>
//             <Text style={{color: Colors.green, marginTop: Metrics.small}}>
//               {guide[data.index]}
//             </Text>
//           </View>
//           <View style={{flexDirection: 'column', flex: 0.2}}>
//             <Text style={{paddingTop: Metrics.normal}}>
//               {utils.formatValue(parseFloat(data.item.price), ',', '', '')}
//             </Text>
//             <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
//               {quantity[data.index]}
//             </Text>
//           </View>
//         </View>
//       </TouchableHighlight>
//     );
//   };

//   const renderHiddenItem = data => (
//     <View style={styles.rowBack}>
//       <TouchableOpacity
//         style={[styles.backLeftBtn, styles.backLeftBtnLeft]}
//         onPress={() => {
//           _onClickDelete(data);
//         }}>
//         <Text style={styles.backTextWhite}>{i18n.t('listItem.delete')}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.backRightBtn, styles.backRightBtnLeft]}
//         onPress={() => addCookingGuide(data)}>
//         <Text style={styles.backTextWhite}>
//           {i18n.t('listItem.changeGuide')}
//         </Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={[styles.backRightBtn, styles.backRightBtnRight]}
//         onPress={() => addQuantity(data)}>
//         <Text style={styles.backTextWhite}>{i18n.t('listItem.changeQty')}</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const rendeShowSearch = () => {
//     return (
//       <View style={styles.searchBar}>
//         <View>
//           <SearchBar
//             placeholder={i18n.t('listItem.holderfood')}
//             onChangeText={query => {
//               setSearchQuery(query);
//             }}
//             lightTheme={true}
//             value={searchQuery}
//             inputContainerStyle={styles.searchInputContainer}
//             inputStyle={styles.textSearchInput}
//             containerStyle={styles.searchContainer}
//           />
//         </View>
//         {/* {isLoading && (
//             <ActivityIndicator
//               animating={true}
//               color={Colors.primary}
//               size={"large"}
//             />
//           )} */}
//       </View>
//     );
//   };
//   const renderShowGuide = () => {
//     return (
//       <Provider>
//         <Modal
//           title={i18n.t('listItem.addGuide')}
//           transparent={true}
//           onClose={_onModaladdGuide}
//           maskClosable
//           visible={isAddGuide}
//           closable>
//           <View
//             style={{
//               paddingVertical: Metrics.medium,
//               marginVertical: Metrics.small,
//             }}>
//             <View style={styles.stepperQTY}>
//               <TextInput
//                 style={styles.textGuide}
//                 autoCorrect={false}
//                 onChangeText={value =>
//                   setGuide(prev => {
//                     prev[indexGuide] = value;
//                     return [...prev];
//                   })
//                 }
//                 value={guide[indexGuide]}
//                 keyboardType="default"
//               />
//             </View>
//           </View>
//           <Button type="primary" onPress={_onModaladdGuide}>
//             {i18n.t('base.save')}
//           </Button>
//         </Modal>
//       </Provider>
//     );
//   };

//   const renderShowAddQuantity = () => {
//     return (
//       <Provider>
//         <Modal
//           title={i18n.t('listItem.addQty')}
//           transparent
//           onClose={_onModalAddQty}
//           maskClosable
//           visible={isAddQty}
//           closable>
//           <View
//             style={{
//               paddingVertical: Metrics.medium,
//               marginVertical: Metrics.small,
//             }}>
//             <View style={styles.stepperQTY}>
//               <Stepper
//                 key="1"
//                 max={50}
//                 min={1}
//                 defaultValue={quantity[indexAdd]}
//                 onChange={value => updateQTY(value, indexAdd)}
//               />
//             </View>
//             <Button
//               type="primary"
//               onPress={_onModalAddQty}
//               style={{marginTop: 32}}>
//               {i18n.t('base.save')}
//             </Button>
//           </View>
//         </Modal>
//       </Provider>
//     );
//   };
//   const rendShowModal = () => {
//     const number = listSelected.length + selectItem.length;
//     return (
//       <View style={styles.btnShowModal}>
//         <Badge text={number}>
//           <TouchableOpacity
//             style={styles.addToMenu}
//             onPress={() => {
//               handlePostInsertItem();
//             }}>
//             <Text style={styles.txtShowModal}>{i18n.t('base.addOrder')}</Text>
//           </TouchableOpacity>
//         </Badge>
//       </View>
//     );
//   };

//   const dataSearch = useMemo(() => {
//     if (!searchQuery) {
//       return listItem;
//     } else {
//       return listItem.filter(o =>
//         ['iCode', 'iname'].some(k => {
//           return o[k]
//             ?.toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .includes(
//               searchQuery
//                 .toLowerCase()
//                 .normalize('NFD')
//                 .replace(/[\u0300-\u036f]/g, ''),
//             );
//         }),
//       );
//     }
//   }, [searchQuery, listItem]);

//   return (
//     <SafeAreaInsetsContext.Consumer>
//       {insets => (
//         <Fragment>
//           <GeneralStatusBar
//             backgroundColor={Colors.primary}
//             barStyle="light-content"
//           />
//           <SafeAreaView
//             style={{
//               backgroundColor: Colors.primary,
//               paddingTop: 0,
//               paddingBottom: Platform.OS == 'ios' ? -48 : 0,
//             }}>
//             {renderHeader()}
//           </SafeAreaView>
//           {rendeShowSearch()}
//           {/* <View style={styles.container}> */}
//           <SwipeListView
//             data={dataSearch}
//             renderItem={renderItem}
//             renderHiddenItem={renderHiddenItem}
//             leftOpenValue={75}
//             rightOpenValue={-150}
//             previewRowKey={'0'}
//             previewOpenValue={-40}
//             previewOpenDelay={3000}
//           />
//           {/* </View> */}
//           {isAddQty ? renderShowAddQuantity() : null}
//           {isAddGuide ? renderShowGuide() : null}
//           {selectItem.length > 0 ? rendShowModal() : null}
//         </Fragment>
//       )}
//     </SafeAreaInsetsContext.Consumer>
//   );
// };

// const styles = StyleSheet.create({
//   iconback: {
//     width: Metrics.normal,
//     height: Metrics.normal,
//     color: Colors.white,
//   },
//   iconSearch: {
//     width: Metrics.medium,
//     height: Metrics.medium,
//     tintColor: Colors.white,
//   },
//   hitSlop: {
//     top: Metrics.regular,
//     bottom: Metrics.regular,
//     left: Metrics.regular,
//     right: Metrics.regular,
//   },
//   toolbar: {
//     ...Helpers.rowCross,
//     ...Helpers.mainSpaceBetween,
//     ...Metrics.regularHorizontalPadding,
//     backgroundColor: Colors.primary,
//     height: Metrics.medium * 2,
//     borderBottomColor: Colors.light_gray,
//     borderBottomWidth: 1,
//   },
//   toolbarTitle: {
//     ...Helpers.row,
//     ...Helpers.crossCenter,
//     ...Fonts.large,
//     color: Colors.white,
//   },
//   viewListItem: {
//     flexDirection: 'row',
//     padding: Metrics.medium,
//     marginVertical: Metrics.small,
//     marginHorizontal: Metrics.regular,
//   },
//   container: {
//     flex: 1,
//     // marginTop: StatusBar.currentHeight || 0,
//   },
//   imageItem: {
//     width: Metrics.large * 1.5,
//     height: Metrics.large * 1.5,
//     marginTop: Metrics.small,
//   },
//   btnShowModal: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   //swipe
//   rowFront: {
//     backgroundColor: '#FFF',
//     borderBottomColor: Colors.line_primary,
//     borderBottomWidth: 1,
//     justifyContent: 'center',
//     height: 70,
//   },
//   backgroundSelected: {
//     backgroundColor: Colors.line_primary,
//   },
//   renderItem: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginHorizontal: Metrics.small,
//   },
//   rowBack: {
//     alignItems: 'center',
//     backgroundColor: '#DDD',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingLeft: 15,
//   },
//   backRightBtn: {
//     alignItems: 'center',
//     bottom: 0,
//     justifyContent: 'center',
//     position: 'absolute',
//     top: 0,
//     width: 75,
//   },
//   backLeftBtn: {
//     alignItems: 'center',
//     bottom: 0,
//     justifyContent: 'center',
//     position: 'absolute',
//     top: 0,
//     width: 75,
//   },
//   backRightBtnLeft: {
//     backgroundColor: Colors.line_color,
//     right: 75,
//   },
//   backRightBtnRight: {
//     backgroundColor: Colors.primary,
//     right: 0,
//   },
//   backLeftBtnLeft: {
//     backgroundColor: 'red',
//     left: 0,
//   },
//   stepperQTY: {
//     position: 'absolute',
//     top: 0,
//     left: Metrics.small,
//     width: Metrics.large * 7.5,
//     marginBottom: Metrics.medium,
//     alignContent: 'center',
//   },
//   //
//   addToMenu: {
//     width: Metrics.large * 10,
//     height: Metrics.medium * 2,
//     borderColor: Colors.line_primary,
//     borderWidth: 0.5,
//     borderRadius: Metrics.normal,
//     backgroundColor: Colors.line_primary,
//     marginVertical: Metrics.small,
//   },
//   txtShowModal: {
//     textAlign: 'center',
//     marginVertical: Metrics.normal,
//     color: Colors.white,
//   },
//   iconGuide: {
//     position: 'absolute',
//     top: Metrics.large * 2.4,
//     left: Metrics.large * 10.2,
//   },
//   textGuide: {
//     borderColor: Colors.gray,
//     borderRadius: Metrics.small,
//     borderWidth: 0.5,
//   },
//   searchInputContainer: {
//     backgroundColor: Colors.white,
//     borderColor: Colors.white,
//   },
//   textSearchInput: {
//     fontSize: Metrics.regular - 2,
//   },
//   searchContainer: {
//     padding: 0,
//     backgroundColor: Colors.backgroundColorLineHeight,
//   },
// });

// export default SearchScreen;

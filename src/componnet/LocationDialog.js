// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { TouchableOpacity } from 'react-native';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableWithoutFeedback,
//   FlatList,
// } from 'react-native';
// import Dialog, { DialogContent } from 'react-native-popup-dialog';
// import { Icon, SearchBar } from 'react-native-elements';
// import { Colors, Fonts, Helpers, Metrics } from '../../theme';
// import AsyncStorage from '@react-native-community/async-storage';
// import { useSelector } from 'react-redux';
// import ListItemAPI from '../../core/api/ListItemAPI';
// import i18n from '../../i18n/i18n';

// const LocationDialog = props => {
//   const { dataSource, res, navigation } = props;
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isVisible, setIsVisible] = useState(false);
//   setSelected;
//   const [selected, setSelected] = useState([]);
//   const loginReducer = useSelector(state => state.user);
//   const [quantity, setQuantity] = useState([]);

//   useEffect(() => {
//     setIsVisible(true);
//     setQuantity([...Array(dataSearch.length).keys()].map(() => 0));
//   }, []);

//   const _onBackPress = () => {
//     setIsVisible(false);
//     navigation.navigate('MenuScreen', res);
//   };

//   const renderItem = (item, index) => {
//     return (
//       <TouchableOpacity onPress={() => {
//         _handleSubmit(item);
//         quantity[index]=quantity[index]+1
//       setQuantity(quantity);
//       }}
//       style={selected.map(ele =>
//         ele === item.iCode ? styles.backgroundSelected : null,
//       )}>
//         <View style={styles.itemSelect}>
//           <Text>
//             {item.iCode} - {item.iname}
//           </Text>
//           <View style={styles.txtQuantity}>
//             <Text>{quantity[index]=== 0 ? '':quantity[index]}</Text>
//           </View>          
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const _handleSubmit = async (item,index) => {
//     const cleckID = loginReducer.Initial;
//     const userLog = await AsyncStorage.getItem('activeLogin');
//     setSelected(prev => [...prev, item.iCode]);
//     const params = [
//       {
//         myCheckNo: `${res.params || res.responseJson || res.openNew}`,
//         iQty: '1',
//         icode: item.iCode,
//         itemName: item.iname,
//         iPrice: `${item.price}`,
//         lGuide: '',
//         gNo: '1',
//         menuNum: `${item.iCode.substring(0, 3)}`,
//         gRVCNo: item.rvc,
//         gClerkID: userLog || cleckID,
//       },
//     ];
//     const postItem = await ListItemAPI.postInsertItem(JSON.stringify(params));
//     if (postItem) {
//       console.log('oke');
      
//     }
//   };

//   const renderDialog = () => {
//     return (
//       <Dialog
//         visible={isVisible}
//         dialogTitle={
//           <View style={{ ...styles.toolbar }}>
//             <View />
//             <Text style={{ ...styles.toolbarTitle }}>
//               {i18n.t('listItem.search')}
//             </Text>
//             <TouchableOpacity
//               hitSlop={styles.hitSlop}
//               onPress={() => {
//                 _onBackPress();
//               }}>
//               <Icon
//                 name="close-outline"
//                 type="ionicon"
//                 size={Metrics.medium}
//                 color={Colors.white}
//               />
//             </TouchableOpacity>
//           </View>
//         }
//         width={0.9}
//         height={0.58}
//         containerStyle={{ alignSelf: 'baseline' }}>
//         <DialogContent>
//           <TouchableWithoutFeedback
//             style={{ flex: 1.2 }}
//             onPress={() => Keyboard.dismiss()}>
//             <View style={styles.containerStyle}>{renderContentDialog()}</View>
//           </TouchableWithoutFeedback>
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   const renderContentDialog = () => {
//     return (
//       <>
//         <View style={styles.searchBar}>
//           <View>
//             <SearchBar
//               placeholder={i18n.t('listItem.holderfood')}
//               onChangeText={query => {
//                 setSearchQuery(query);
//               }}
//               lightTheme={true}
//               value={searchQuery}
//               inputContainerStyle={styles.searchInputContainer}
//               inputStyle={styles.textSearchInput}
//               containerStyle={styles.searchContainer}
//             />
//           </View>
//           {/* {isLoading && (
//             <ActivityIndicator
//               animating={true}
//               color={Colors.primary}
//               size={"large"}
//             />
//           )} */}
//         </View>
//         <FlatList
//           data={dataSearch}
//           renderItem={({ item: rowData, index }) => renderItem(rowData, index)}
//           contentContainerStyle={styles.listContent}
//           keyExtractor={dataSearchKeyExtractor}
//           onEndReachedThreshold={0.1}
//           pageSize={5}
//           ItemSeparatorComponent={renderItemSeparator}
//         />
//       </>
//     );
//   };

//   const dataSearchKeyExtractor = useCallback(item => `item ${item.iCode}`, []);
//   const renderItemSeparator = () => {
//     return <View style={styles.itemSeparator} />;
//   };
//   const dataSearch = useMemo(() => {
//     if (!searchQuery) {
//       return dataSource;
//     } else {
//       return dataSource.filter(o =>
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
//   }, [searchQuery, dataSource]);
//   return <>{renderDialog()}</>;
// };

// const styles = StyleSheet.create({
//   iconback: {
//     width: Metrics.normal,
//     height: Metrics.normal,
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
//   searchInputContainer: {
//     backgroundColor: Colors.white,
//     borderColor: Colors.white,
//   },
//   textSearchInput: {
//     fontSize: Metrics.regular - 2,
//   },
//   searchContainer: {
//     padding: 0,
//     backgroundColor: Colors.backgroundColor,
//     // marginHorizontal:Metrics.regular,
//     // marginBottom: Metrics.small,
//   },
//   itemSeparator: {
//     borderBottomColor: Colors.light_gray,
//     borderBottomWidth: 0.8,
//   },
//   itemSelect: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: Metrics.normal,
//   },
//   backgroundSelected: {
//     backgroundColor: Colors.line_primary,
//   },
//   txtQuantity:{marginRight:Metrics.small}
// });

// export default LocationDialog;

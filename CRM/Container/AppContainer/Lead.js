//This is an example code to set Backgroud image///
import React, { useState ,useRef,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SnackBar from 'react-native-snackbar-component';
import RBSheet from "react-native-raw-bottom-sheet";
import * as BindActions from '../Redux/Actions';
import { View, Linking,Text,Dimensions,FlatList, Image,StyleSheet,SafeAreaView,TouchableOpacity ,ActivityIndicator} from 'react-native';
const WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = 50;
import { Header,Left, Right, Body, Thumbnail } from 'native-base';
import {Container, Tab, Tabs, StyleProvider} from 'native-base';
import MaterialTabs from 'react-native-material-tabs';
import AddEnquiry from '../Components/AddEnquiry'
import Leadsheet from '../Components/Leadsheet'
import SearchBar from 'react-native-searchbar';
let InitialLead=[];
 const  Lead  = (props) => {
  const RBSheetRef = useRef();
  const RBSheetsRef = useRef();
  const searchBar=useRef();
 const [selectedTab,setselectedTab]=useState(0) 
 const [LeadList,setLeadList]=useState([]) 
 const [BillList,setBillList]=useState({});
 const [TabText,setTabText]=useState('all')
 
 const closes=()=>{
   console.log('onShut')
   RBSheetsRef.current.close();
  }
  const setTab=(s)=> {
    let tab=s.i;
    console.log('Tab',tab)
   setselectedTab(tab)
   let status='';
   if(tab===0){
     status='all'
   }
   if(tab===1){
     setPage(1)
    setLeadList([])
     status='enquiry'
   }
   if(tab===2){
    setPage(1)
    setLeadList([])
    status='lead'
  }
  if(tab===3){
    setPage(1)
    setLeadList([])
    status='prospect'
  }
  if(tab===4){
    setPage(1)
    setLeadList([])
    status='deal'
  }
  if(tab===5){
    setPage(1)
    setLeadList([])
    status='dropped'
  }
   setTabText(status)
  }
 
  const dispatch = useDispatch();
  const [loader, setLoading] = useState(true);
  const [page,setPage]=useState(1)
  const [id,setId]=useState('');
  const [success,AddResponses]=useState()
  const [ShowAlert, setAlerts] = useState(false);
  const AddResponse = useSelector(state => state.AddLeadReducer);
  const [error, setError] = useState('');
  const [ShowAlertSuccess, setAlertsSuccess] = useState(false);
  const LeadOperation = useSelector(state => state.LeadReducer);
  const LeadConverterOperation=useSelector(state=>state.LeadConvertReducer)
  const LeadsourceReducer=useSelector(state=>state.LeadsourceReducer)
  const AssignTo=useSelector(state=>state.AssignTo)
  const loginOperation = useSelector(state => state.userReducer);
  const billOperation = useSelector(state => state.BillReducer);
  useEffect(()=>{
    getLeadsData()
   getLeadsDataSource()
  },[TabText,AddResponse,LeadConverterOperation])
 function getLeadsData(){
   let params={
    page:page,
    count:5,
    contactId:'',
    assignee:'',
    stage:'',
    contact_person:'',
    phone:'',
    email :'',
    created_date:'',
    from_date:'',
    to_date:''
   }
   let token=loginOperation.loginResponse.token;
   console.log('token',token)
   dispatch(BindActions.LeadApi(params,token,"/leads/list/"+`${TabText}`))
 }
 function getLeadsDataSource(){
  let token=loginOperation.loginResponse.token;
  console.log('token',token)
  dispatch(BindActions.LeadSource('',token,"/settings/customization/lead_sources")).then(res=>{
    getAssignTo();
  })
}
function getAssignTo(){
  let token=loginOperation.loginResponse.token;
  console.log('token',token)
  dispatch(BindActions.AssignTo('',token,"/settings/user/names"))
}
 if (LeadOperation.leadPending) {
  LeadOperation.leadPending=false
   // setLoading(true)
    setAlerts(false);
}

 if (LeadOperation.leadSuccess) {
  console.log('LeadOperation',LeadOperation)
  LeadOperation.leadSuccess=false
  setLoading(false)
  setAlerts(false);
  InitialLead=LeadOperation.LeadResponse.records;
  setLeadList([...LeadList,...LeadOperation.LeadResponse.records])
}
if (LeadOperation.IsleadError) {
  LeadOperation.IsleadError=false
  setLoading(false)
  setAlerts(true);
  setError(LeadOperation.leaderror.message)

}
//---------------------
console.log('LeadsourceReducer',LeadsourceReducer)
if (LeadsourceReducer.LeadSourcePending) {
  LeadsourceReducer.LeadSourcePending=false
    setLoading(true)
    setAlerts(false);
}

 if (LeadsourceReducer.LeadSourceSuccess) {
  console.log('LeadOperation',LeadOperation)
  LeadsourceReducer.LeadSourceSuccess=false
  setLoading(false)
 
}
if (LeadsourceReducer.IsLeadSourceError) {
  LeadsourceReducer.IsLeadSourceError=false
  setLoading(false)
  setAlerts(true);
  setError(LeadsourceReducer.LeadSourceerror.message)

}
if (billOperation.BillPending) {
  billOperation.BillPending=false
    setLoading(true)
    setAlerts(false);
}
 if (billOperation.BillSuccess) {
  billOperation.BillSuccess=false
  setLoading(false)
  setAlerts(false);
 // console.log('BillOperation',billOperation)
 // setBillList(billOperation.BillResponse)
}
if (billOperation.IsBillError) {
  billOperation.IsBillError=false
  setLoading(false)
  setAlerts(true);
  setError(billOperation.Billerror.message) 

}

//--------assign To
console.log('LeadsourceReducer',AssignTo)
if (AssignTo.AssignToPending) {
  AssignTo.AssignToPending=false
    setLoading(true)
    setAlerts(false);
}

 if (AssignTo.AssignToSuccess) {
  
  AssignTo.AssignToSuccess=false
  setLoading(false)
 
}
if (AssignTo.IsAssignToError) {
  AssignTo.IsAssignToError=false
  setLoading(false)
  setAlerts(true);
  setError(AssignTo.AssignToerror.message)

}
const snackBarActions = () => {
  setAlerts(false);
};
const _handleResults =(e)=>{
  console.log('e',e)

    let texts = e.toLowerCase()
    
    let filteredName = LeadList.filter((item) => {
      return item.contact_first_name.toLowerCase().match(texts)
    })
    if (!texts || texts === '') {
      setLeadList(InitialLead)
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
      setLeadList(InitialLead)
    } else if (Array.isArray(filteredName)) {
      setLeadList(filteredName)
    }
  

}
const selectedLead=(item)=>{
  console.log('item.lead_id',item.lead_id)
  setId(item.lead_id)
  setTimeout(()=>RBSheetRef.current.open(),100)
 
}
const goback=()=>{
  props.navigation.goBack(null);
}
 const Success=(text)=>{ 
  setAlertsSuccess(true);
  AddResponses(text)
  
}
function details(item){
   console.log('item',item)
   props.navigation.navigate('EnquiryDetailPage',{item:item})
}
const getBillItems=(item)=>{
  let token=loginOperation.loginResponse.token;
  let params={
    ids:81
  }
  dispatch(BindActions.BillApi(params,token,"/leads/list/bills"));
}
function loadMoreData(){
  setPage(page+1)
  getLeadsData()
  
}
function renderFooter() {
  return (
  //Footer View with Load More button
    <View style={styles.footer}>
    
    <ActivityIndicator color="#000" size='large' style={{ marginLeft: 8 }} />
    
    </View>
  );
}
const getItems = ({item}) => {
    //getBillItems(item);
    return (
      <TouchableOpacity onPress={()=>details(item)}>
        <View style={{backgroundColor:'#fff',height:180,padding:20,justifyContent:'space-between',borderRadius:15,
        shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{flexDirection:'row'}}>
            <View style={{width:50,height:50,borderRadius:10,justifyContent:'center',alignItems:'center',backgroundColor:'#00A3E0',position:'relative'}}>
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:12}}>{item.contact_first_name.charAt(0)}</Text>
             <View style={{position:'absolute',bottom:-10,alignSelf:'center',justifyContent:'center',width:20,height:20,borderRadius:10,backgroundColor:'#f4a640',alignItems:'center'}}>
             <Image 
            source={require('../Assets/star.png')}
            style={{width:10,height:10,resizeMode:'contain',tintColor:'#fff'}}
          />
             </View>
            </View>
            <View style={{marginLeft:30}}>
            <Text style={{color:'#000',fontWeight:'bold',fontSize:12,}}>{item.contact_first_name+" "+item.contact_last_name}</Text>
            <Text style={{color:'gray',fontWeight:'bold',fontSize:12}}>{item.company_name}</Text>
            <View style={{flexDirection:'row',marginTop:10}}>
              <TouchableOpacity onPress={()=>Linking.openURL(`tel:${item.phone}`)}>
            <View style={{width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center',backgroundColor:'gray',position:'relative'}}>
            <Image 
            source={require('../Assets/phone.png')}
            style={{width:10,height:10,resizeMode:'contain',tintColor:'#fff'}}
          />
            </View>
            </TouchableOpacity>
            <View style={{paddingLeft:5,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'#000',fontWeight:'bold',fontSize:12}}>{item.phone}</Text>
            </View>
            </View>
            <View style={{flexDirection:'row',marginTop:10}}>
              <TouchableOpacity onPress={()=>Linking.openURL(`mailto:${item.email}`)}>
            <View style={{width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center',backgroundColor:'gray',position:'relative'}}>
            <Image 
            source={require('../Assets/mail.png')}
            style={{width:10,height:10,resizeMode:'contain',tintColor:'#fff'}}
          />
            </View>
            </TouchableOpacity>
            <View style={{paddingLeft:5,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'#000',fontWeight:'bold',fontSize:12}}>{item.email}</Text>
            </View>
            </View>
            <View style={{flexDirection:'row',}}>
            {/* <View style={{width:80,height:25,borderRadius:30,backgroundColor:'#f4a640',justifyContent:'center',alignItems:'center',marginTop:10}}>
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:12}}>$ 15,0000</Text>
            </View>
            <View style={{justifyContent:'center',alignItems:"center",marginTop:10,paddingLeft:5}}>
            <Text style={{color:'gray',fontWeight:'bold',fontSize:12}}>Received</Text>
            </View> */}
            <View style={{width:80,height:25,borderRadius:30,backgroundColor:'gray',justifyContent:'center',alignItems:'center',marginTop:10,marginLeft:10}}>
    <Text style={{color:'#fff',fontWeight:'bold',fontSize:12}}>{item.lead_status}</Text>
            </View>
            </View>
           
            </View>
            </View>
            {TabText==='all'?null:<TouchableOpacity onPress={()=>selectedLead(item)}>
            <View style={{width:30,height:30,borderRadius:15,justifyContent:'center',alignItems:'center',backgroundColor:'#f39a3e',position:'relative'}}>
            <Image 
            source={require('../Assets/moredots.png')}
            style={{width:10,height:10,resizeMode:'contain',tintColor:'#fff'}}
          />
            </View>
            </TouchableOpacity>}
            
        
          
          </View>
        </View></TouchableOpacity>
    );
}
  

    return (
      <Container style={{backgroundColor: '#fff',flex:1}}>
          <Header style={{ backgroundColor: '#00A3E0' ,alignItems: 'center', justifyContent: 'center'}}>
           <Left style={{ flexDirection: 'row' }} >
           <TouchableOpacity onPress={()=>goback()}>
             <Image 
            
            source={require('../Assets/back.png')}
            style={{width:20,height:20,resizeMode:'contain',tintColor:'#fff'}}
          />
          </TouchableOpacity>
              </Left>
             <Body >
                <Text style={{fontWeight:'bold',fontSize:18,color:'#fff'}} >Leads</Text>
            </Body>
            <Right style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={()=>searchBar.current.show()}>
              
          <Image 
            source={require('../Assets/search.png')}
            style={styles.ImageStyle}
          />
        
                </TouchableOpacity>
              </Right>
        </Header>
      <SafeAreaView>
        <View >
        <TouchableOpacity onPress={()=>RBSheetsRef.current.open()}>
              <View style={{alignSelf:'flex-end',width:120,height:40,backgroundColor:'#f39a3e',justifyContent:'center',alignItems:'center',flexDirection:'row',borderRadius:6}}>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Image 
            source={require('../Assets/more.png')}
            style={{width:10,height:10,resizeMode:'contain',tintColor:'#fff'}}
          />
                        </View>
<Text style={{color:'#fff',fontWeight:'bold',fontSize:14,paddingLeft:10}}>Add Enquiry</Text>
              </View>
              </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Tabs onChangeTab={(tab)=>setTab(tab)}  tabBarUnderlineStyle={{backgroundColor: '#00A3E0'}}>
        <Tab
          textStyle={{
            color: '#000',
            fontSize: 10,
           
          }}
          activeTextStyle={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 10,
           
          }}
          activeTabStyle={{backgroundColor: '#00A3E0'}}
          tabStyle={{backgroundColor: '#fff'}}
          heading={`All `}>
          <View style={{flex:1}}>
          {loader?<ActivityIndicator style={{justifyContent:'center',alignItems:'center'}} size="large" color="#0000ff" />:LeadList.length>0?
                 <View>
                  <FlatList
                  style={{ flexGrow: 1, paddingBottom: 20}}   
                  data={LeadList}              
                  renderItem={(item, index) =>getItems(item, index)}
                  onEndReached={loadMoreData}
            onEndReachedThreshold ={0.2}
            ListFooterComponent={renderFooter}
                /></View>:null}
       
          </View>
        </Tab>
        <Tab
          textStyle={{
            color: '#000',
            fontSize: 10,
           
          }}
          activeTextStyle={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 10,
           
          }}
          activeTabStyle={{backgroundColor: '#00A3E0'}}
          tabStyle={{backgroundColor: '#fff'}}
          heading={`Enquiry `}>
          <View style={{flex:1}}>
          {loader?<ActivityIndicator style={{justifyContent:'center',alignItems:'center'}} size="large" color="#0000ff" />:LeadList.length>0?
                 <View>
                  <FlatList
                  style={{ flexGrow: 1, paddingBottom: 20}}   
                  data={LeadList}              
                  renderItem={(item, index) =>getItems(item, index)}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold ={0.2}
                  ListFooterComponent={renderFooter}
                /></View>:null}
          </View>
        </Tab>
        <Tab
          textStyle={{
            color: '#000',
            fontSize: 10,
           
          }}
          activeTextStyle={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 10,
           
          }}
          activeTabStyle={{backgroundColor: '#00A3E0'}}
          tabStyle={{backgroundColor: '#fff'}}
          heading={`Lead `}>
          <View style={{flex:1}}>
          {loader?<ActivityIndicator style={{justifyContent:'center',alignItems:'center'}} size="large" color="#0000ff" />:LeadList.length>0?
                 <View>
                  <FlatList
                  style={{ flexGrow: 1, paddingBottom: 20}}   
                  data={LeadList}              
                  renderItem={(item, index) =>getItems(item, index)}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold ={0.2}
                  ListFooterComponent={renderFooter}
                /></View>:null}
          </View>
        </Tab>
        <Tab
          textStyle={{
            color: '#000',
            fontSize: 10,
           
          }}
          activeTextStyle={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 10,
           
          }}
          activeTabStyle={{backgroundColor: '#00A3E0'}}
          tabStyle={{backgroundColor: '#fff'}}
          heading={`Prospects `}>
          <View style={{flex:1}}>
          {loader?<ActivityIndicator style={{justifyContent:'center',alignItems:'center'}} size="large" color="#0000ff" />:LeadList.length>0?
                 <View>
                  <FlatList
                  style={{ flexGrow: 1, paddingBottom: 20}}   
                  data={LeadList}              
                  renderItem={(item, index) =>getItems(item, index)}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold ={0.2}
                  ListFooterComponent={renderFooter}
                /></View>:null}
          </View>
        </Tab>
        <Tab
          textStyle={{
            color: '#000',
            fontSize: 10,
           
          }}
          activeTextStyle={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 10,
           
          }}
          activeTabStyle={{backgroundColor: '#00A3E0'}}
          tabStyle={{backgroundColor: '#fff'}}
          heading={`Deals `}>
          <View style={{flex:1}}>
          {loader?<ActivityIndicator style={{justifyContent:'center',alignItems:'center'}} size="large" color="#0000ff" />:LeadList.length>0?
                 <View>
                  <FlatList
                  style={{ flexGrow: 1, paddingBottom: 20}}   
                  data={LeadList}              
                  renderItem={(item, index) =>getItems(item, index)}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold ={0.2}
                  ListFooterComponent={renderFooter}
                /></View>:null}
          </View>
        </Tab>
        <Tab
          textStyle={{
            color: '#000',
            fontSize: 10,
           
          }}
          activeTextStyle={{
            color: '#fff',
            fontWeight: '500',
            fontSize: 10,
           
          }}
          activeTabStyle={{backgroundColor: '#00A3E0'}}
          tabStyle={{backgroundColor: '#fff'}}
          heading={`Dropped `}>
          <View style={{flex:1}}>
          {loader?<ActivityIndicator style={{justifyContent:'center',alignItems:'center'}} size="large" color="#0000ff" />:LeadList.length>0?
                 <View>
                  <FlatList
                  style={{ flexGrow: 1, paddingBottom: 20}}   
                  data={LeadList}              
                  renderItem={(item, index) =>getItems(item, index)}
                  onEndReached={loadMoreData}
                  onEndReachedThreshold ={0.2}
                  ListFooterComponent={renderFooter}
                /></View>:null}
          </View>
        </Tab>
</Tabs>
<View>
<RBSheet
          ref={RBSheetsRef}
          height={700}
          duration={250}
          customStyles={{
            container: {
            borderTopLeftRadius:25,
            borderTopRightRadius:25
            }
          }}
        >
          <AddEnquiry Success={(text)=>Success(text)} LeadList={LeadList} onShut={()=>closes()} props={props} />
        </RBSheet> 
                </View>
               <View>
               <RBSheet
       ref={RBSheetRef}
      
          height={120}
          duration={250}
          customStyles={{
            container: {
            borderTopLeftRadius:25,
            borderTopRightRadius:25
            }
          }}
        >
          <Leadsheet Successs={(text)=>Success(text)} leadId={id}  tabText={TabText}  onShut={()=>RBSheetRef.current.close()}  />
        </RBSheet> 
                 </View> 
           
            <SearchBar
  ref={searchBar}
  data={LeadList}
  handleChangeText={_handleResults}
  showOnLoad={false}
/>
<SnackBar
          visible={ShowAlert}
          textMessage={error}
          actionHandler={() => snackBarActions()}
          actionText="DISMISS"
        />
      <SnackBar
            autoHidingTime={2000}
         backgroundColor='green'
          visible={ShowAlertSuccess}
          textMessage={success}
          
          actionHandler={() => snackBarActions()}
          actionText=""
        />
</Container>

              
    
  
    );
        }
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  searchIcon: {
    padding: 10,
    width:30,
    height:30,
},
ImageStyle: {
    padding: 10,
    margin: 5,
    height: 10,
    tintColor:'#fff',
    width: 10,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderWidth: 0.1,
    borderColor: '#000',
    borderRadius:30,
    height: 40,
    
    margin: 10,
  },
  itemTitle: {   
    color: '#4e649f',
    padding: 5,marginLeft:20
  },
  itemContainer: {
    width: WIDTH,
    flex: 1,
    flexDirection: 'column',
    height: ITEM_HEIGHT
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextStyle: {
    color: '#0250a3',
    textAlign: 'center',
    fontSize: 30,
    marginTop: 10,
  },
});
export default Lead;
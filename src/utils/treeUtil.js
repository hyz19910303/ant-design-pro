
/**
* 数组, 名称字段
*/
export default function listDataConvertSelectTreeData(list,str){    
 	if(!Array.isArray(list)){
 		throw Error('必须传入数组');
 	}   
    for(var i=0;i<list.length;i++){
      let item=list[i];
      item.title=item[str];
      item.key=item.id;
      item.value=item.id;
      if(item.children){
        listDataConvertSelectTreeData(item.children,str);
      }
      
    }
 }
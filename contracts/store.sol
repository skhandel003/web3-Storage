// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;
contract store{
 address private owner ;
 uint256 public balance;
 constructor()public payable{
    owner = msg.sender;
    //balance = msg.value;
 }

 struct data{
 address dataowner;
 uint256 i;
 string[] base64images;
 string htmltext;
 }
 


    mapping(address => data) private pdfs;
    uint256 private nextId;
   
 function pushimg(string memory  base64_img) public {
    if(pdfs[msg.sender].i == 0){
        pdfs[msg.sender].dataowner = msg.sender;
        (pdfs[msg.sender].i)++;
    }
    pdfs[msg.sender].base64images.push(base64_img);     
  } 
function pushtext(string memory text) public {
    if(pdfs[msg.sender].i == 0){
        pdfs[msg.sender].dataowner = msg.sender;
        (pdfs[msg.sender].i)++;
    }
    pdfs[msg.sender].htmltext = text;
}
   
    
    function returnImage(uint n) public isdata view returns(string memory) {
       require(n < pdfs[msg.sender].base64images.length, "Index out of bounds");
        
        return (pdfs[msg.sender].base64images[n]);

    }
    function returntext () public isdata view returns(string memory){
        return pdfs[msg.sender].htmltext;
    }
        
    function returnowner() public view returns(address ){
        return owner;
    }
   
    
    
     modifier isdata
    { 
        require(pdfs[msg.sender].i == 1,"You have no data"); 
        _; 
    } 

}
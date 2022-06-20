// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Azuki is Ownable, ERC721A, ReentrancyGuard {

  constructor() ERC721A("Azuki", "AZUKI") {
  }

  function mintWarpper(address to, uint256 quantity) external onlyOwner {
      _safeMint(to, quantity);
  }

  // // metadata URI
  string private _baseTokenURI;

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }

  function setBaseURI(string calldata baseURI) external onlyOwner {
    _baseTokenURI = baseURI;
  }


  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

}

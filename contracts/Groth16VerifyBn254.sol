
// SPDX-License-Identifier: MIT
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTpublic_inputULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

pragma solidity ^0.8.27;
import "./Pairing.sol";

contract Groth16VerifyBn254 {
  uint256 constant PRIME_P = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
  uint256 constant PRIME_Q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
  using Pairing for *;

  struct VerifyingKey {
    Pairing.G1Point alpha1;
    Pairing.G2Point beta2;
    Pairing.G2Point gamma2;
    Pairing.G2Point delta2;
    Pairing.G1Point[13] public_input;
  }

  struct Proof {
    Pairing.G1Point A;
    Pairing.G2Point B;
    Pairing.G1Point C;
  }

  bool public pairingResult;

  function getPairingResult() view public returns(bool){
    return pairingResult;
  }

  function verifyProof(
    uint256[8] memory proof,
    uint256[12] memory input,
    VerifyingKey memory vk
  ) public  {

    Proof memory _proof;
    _proof.A = Pairing.G1Point(proof[0], proof[1]);
    _proof.B = Pairing.G2Point([proof[2], proof[3]], [proof[4], proof[5]]);
    _proof.C = Pairing.G1Point(proof[6], proof[7]);

    Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
    vk_x = Pairing.add(vk_x, vk.public_input[0]);

    for (uint256 i = 0; i < input.length; i++) {
        require(input[i] < PRIME_Q, "verifier-gte-snark-scalar-field");
        vk_x = Pairing.add(vk_x, Pairing.scalar_mul(vk.public_input[i + 1], input[i]));
    }
    
    pairingResult = Pairing.pairing(
        Pairing.negate(_proof.A),
        _proof.B,
        vk.alpha1,
        vk.beta2,
        vk_x,
        vk.gamma2,
        _proof.C,
        vk.delta2
    );
    }
}
Test Websocket Driver
=====================

## Installation

    npm install

## Usage

Run the server:

    node server.js

Open the client in you browser:

    open index.html

Check the consol on both client and server.

## Problem

Sending a Buffer from the server works fine: the ArrayBuffer received matches the one that was sent.

Sending an ArrayBuffer from the client to the server __don't work__: the ArrayBuffer I get from the Buffer in the message event is 8192 byte long instead of 2!

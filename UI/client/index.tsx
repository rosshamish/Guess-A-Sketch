import React = require("react");
import ReactDOM = require("react-dom");

import { Hello, VictoriaTest } from "./components/Hello";
//import { VictoriaTest } from "./components/Hello";

Meteor.startup(() => ReactDOM.render(
    <VictoriaTest compiler="TypeScript" framework="React" />,
    document.getElementById("root")
));

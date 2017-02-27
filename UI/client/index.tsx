import React = require("react");
import ReactDOM = require("react-dom");

import { Hello } from "./components/Hello";

Meteor.startup(() => ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("root")
));

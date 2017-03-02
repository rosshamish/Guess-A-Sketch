import * as React from "react";

export interface HelloProps {compiler: string; framework: string;}

export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework} !</h1>;

export const VictoriaTest = (props: HelloProps) => <h1>ANJU CAN YOU SEE THIS????</h1>;

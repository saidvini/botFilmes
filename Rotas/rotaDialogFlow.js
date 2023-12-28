import { Router } from "express";
import DialogFlowCtrl from "../Controle/dialogFlowCtrl.js";

const rota = new Router();
const ctrl = new DialogFlowCtrl();

rota.post("/", ctrl.processarIntencoes);

export default rota;
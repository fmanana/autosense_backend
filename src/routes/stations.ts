import express from "express";
import { checkAuthentication } from "../middlewares";
import * as StationsController from "../controllers/stations";

const router: express.Router = express.Router();

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: apiKey
 *      name: authorization
 *      in: header
 *      description: The JWT authorization header. The JWT can be fetched from 'localhost:4000/'
 *  schemas:
 *     Station:
 *       type: object
 *       required:
 *         - id_name
 *         - name
 *         - latitude
 *         - longitude
 *         - city
 *         - address
 *         - pumps
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique auto-generated id of the station
 *         id_name:
 *           type: string
 *           description: The id_name of the station
 *         name:
 *           type: string
 *           description: Name of the station
 *         latitude:
 *           type: number
 *           description: Latitude coordinate of the station
 *         longitude:
 *           type: number
 *           description: Longitude coordinate of the station
 *         city:
 *           type: string
 *           description: City in which the station is located
 *         address:
 *           type: string
 *           description: Address of the station
 *         pumps:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pump'
 *           description: List of pumps at the station
 *       example:
 *         id_name: "MIGROL_100041"
 *         name: "Migrol Tankstelle"
 *         latitude: 47.3943939
 *         longitude: 8.52981
 *         city: "Zürich"
 *         address: "Scheffelstrasse 16"
 *         pumps:
 *           [{
 *             id_name: "10001",
 *             fuel_type: "BENZIN_95",
 *             price: 1.68,
 *             station_id: 1,
 *             available: true
 *           },
 *           {
 *             id_name: "10002",
 *             fuel_type: "BENZIN_98",
 *             price: 1.77,
 *             available: false
 *           }]
 *     Pump:
 *       type: object
 *       required:
 *         - id_name
 *         - fuel_type
 *         - price
 *         - station_id
 *         - available
 *       optional:
 *         - deleted
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique auto-generated id of the Pump
 *         id_name:
 *           type: string
 *           description: The id_name of the pump
 *         fuel_type:
 *           type: string
 *           description: The fuel type at the pump
 *         price:
 *           type: number
 *           description: The price of gas at the pump
 *         station_id:
 *           type: integer
 *           description: The station_id of the pump
 *         available:
 *           type: boolean
 *           description: The availability of the pump
 *         deleted:
 *           type: boolean
 *           description: Denotes if the pump should be deleted
 *       example:
 *         id: 1
 *         id_name: "10001"
 *         fuel_type: "BENZIN_95"
 *         price: 1.68
 *         station_id: 1
 *         available: true
 */

/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: The Stations API
 *
 * /:
 *   get:
 *     summary: Returns a list of all the Stations
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the Stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *             items:
 *               $ref: '#/components/schemas/Station'
 *       401:
 *         description: Authorization error. Invalid or missing JWT
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new Station
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       201:
 *         description: The Station was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       400:
 *         description: Bad Request. Missing parameters in request.
 *       401:
 *         description: Authorization error. Invalid or missing JWT
 *       500:
 *         description: Internal server error
 *
 * /{id}:
 *   get:
 *     summary: Get a Station by id
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Station id
 *     responses:
 *       200:
 *         description: The Station description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       401:
 *         description: Authorization error. Invalid or missing JWT
 *       404:
 *         description: The Station was not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update the Station by the id
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Station id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Station'
 *     responses:
 *       200:
 *         description: The Station was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Station'
 *       400:
 *         description: Bad Request because of missing parameters.
 *       401:
 *         description: Authorization error. Invalid or missing JWT
 *       404:
 *         description: The Station was not found
 *       500:
 *         description: Internal server error or missing pump parameter
 *   delete:
 *     summary: Remove the Station by id
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Station id
 *     responses:
 *       200:
 *         description: The Station was deleted
 *       401:
 *         description: The JWT token is missing or invalid
 *       404:
 *         description: The Station was not found
 *       500:
 *         description: Some internal server error
 */

router.get("/", checkAuthentication, StationsController.getAllStationsHandler); // Get all Stations
router.post("/", checkAuthentication, StationsController.createStation); // Create a new Station
router.get("/:id", checkAuthentication, StationsController.getStationByIdHandler); // Get a Station by ID
router.put("/:id", checkAuthentication, StationsController.updateStationHandler); // Update a Station
router.delete("/:id", checkAuthentication, StationsController.deleteStationById); // Delete a Station

export default router;
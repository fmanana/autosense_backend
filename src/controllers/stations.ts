import { Request, Response } from 'express';
import { Station, Pump, getAllStations,
    getStationById,
    addStation,
    updateStation,
    getPumpsByStationId,
    deleteStation,
    addPump,
    getPumpById,
    updatePumpPrice } from '../models/db';

const createStation = async (req: Request, res: Response): Promise<void> => {
    const requiredProperties = ['id_name', 'name', 'latitude', 'longitude', 'city', 'address'];

    // Check if the request body contains all required properties
    for (const prop of requiredProperties) {
        if (!req.body.hasOwnProperty(prop)) {
            res.status(400).json({
                error: "Bad Request",
                message: `The request body must contain a ${prop} property`,
            });
            return;
        }
    }

    if (req.body.pumps) {
        if(!Array.isArray(req.body.pumps)) {
            res.status(400).json({
                error: "Bad Request",
                message: "The pumps property must be an array",
            });
            return;
        }

        const pumpsRequiredProperties = ['fuel_type', 'price', 'available'];
        for (const pump of req.body.pumps) {
            for (const prop of pumpsRequiredProperties) {
                if (!pump.hasOwnProperty(prop)) {
                    res.status(400).json({
                        error: "Bad Request",
                        message: `The pumps property must contain a ${prop} property`,
                    });
                    return;
                }
            }
        }
    }

    try{
        const station : Station = {
            id_name: req.body.id_name,
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            city: req.body.city,
            address: req.body.address,
        };

        const id = addStation(station);

        for (let i = 0; i < req.body.pumps.length; i++) {
            const pumpData : Pump = {
                fuel_type: req.body.pumps[i].fuel_type,
                price: req.body.pumps[i].price,
                station_id: id,
                available: req.body.pumps[i].available,
            };

            addPump(pumpData);
        }

        res.status(201).json({
            message: "Created",
            id: id
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error,
        });
        return;
    }
};

const getAllStationsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const stations = getAllStations();
        for (let i = 0; i < stations.length; i++)
        {
            const pumps = getPumpsByStationId(stations[i].id!);
            stations[i].pumps = pumps;
        }
        res.status(200).json({stations});
    }
    catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error,
        });
    }
};

const deleteStationById = async (req: Request, res: Response): Promise<void> => {
    const stationId = parseInt(req.params.id, 10);
    if (isNaN(stationId)) {
        res.status(400).json({
            error: "Bad Request",
            message: "Invalid station ID",
        });
        return;
    }

    try {
        const station = getStationById(stationId);
        if (!station) {
            res.status(404).json({
                error: "Not Found",
                message: "Station not found",
            });
            return;
        }

        deleteStation(stationId);
        res.status(200).json({
            message: "Station deleted successfully",
        });
    } catch(error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error,
        });
    }
}

const getStationByIdHandler = async (req: Request, res: Response): Promise<void> => {
    const stationId = parseInt(req.params.id, 10);
    if (isNaN(stationId)) {
        res.status(400).json({
            error: "Bad Request",
            message: "Invalid station ID",
        });
        return;
    }

    try {
        const station = getStationById(stationId);
        if (!station) {
            res.status(404).json({
                error: "Not Found",
                message: "Station not found",
            });
            return;
        }

        const pumps = getPumpsByStationId(stationId);

        res.status(200).json({ ...station, pumps});
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error,
        });
    }
};

const updateStationHandler = async (req: Request, res: Response): Promise<void> => {
    const stationId = parseInt(req.params.id, 10);

    if (isNaN(stationId)) {
        res.status(400).json({
            error: "Bad Request",
            message: "Invalid station ID",
        });
        return;
    }

    const station = getStationById(stationId);
    if (!station) {
        res.status(404).json({
            error: "Not Found",
            message: "Station not found",
        });
        return;
    }

    const { id_name, name, latitude, longitude, city, address } = req.body;
    const updatedStation: Station = {
        ...station,
        id_name: id_name || station.id_name,
        name: name || station.name,
        latitude: latitude || station.latitude,
        longitude: longitude || station.longitude,
        city: city || station.city,
        address: address || station.address,
    };

    try {
        updateStation(updatedStation);

        // Update pumps if provided in the request body
        if (req.body.pumps) {
            for (let i = 0; i < req.body.pumps.length; i++) {
                const pumpData: Pump = {
                    id: req.body.pumps[i].id,
                    fuel_type: req.body.pumps[i].fuel_type,
                    price: req.body.pumps[i].price,
                    station_id: stationId,
                    available: req.body.pumps[i].available,
                };


                if (pumpData.id) {
                    const existingPump = getPumpById(pumpData.id);
                    if (existingPump) {
                        updatePumpPrice( pumpData.id, pumpData.price);
                    } else {
                        res.status(404).json({
                            error: "Not Found",
                            message: `Pump with ID ${pumpData.id} not found`,
                        });
                        return;
                    }
                } else {
                    addPump(pumpData);
                }
            }
        }

        res.status(200).json({...updatedStation, pumps: req.body.pumps});
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error,
        });
        return;
    }
};

export { createStation, getAllStationsHandler, deleteStationById, getStationByIdHandler, updateStationHandler };
import { OrgUnit, Workstation } from '../../types';

export const MOCK_ORG_UNITS: OrgUnit[] = [
  { id: 'UNIT-HQ', name: 'Centrala Szczecin', type: 'HQ' },
  { id: 'UNIT-PORT-SWI', name: 'Terminal Świnoujście', type: 'PORT' },
  { id: 'UNIT-PORT-YST', name: 'Terminal Ystad', type: 'PORT' },
  { id: 'UNIT-SHIP-POL', name: 'm/f Polonia', type: 'SHIP' },
  { id: 'UNIT-SHIP-SKA', name: 'm/f Skania', type: 'SHIP' },
];

export const MOCK_WORKSTATIONS: Workstation[] = [
  { id: 'WS-HQ-01', name: 'Księgowość 1', orgUnitId: 'UNIT-HQ', type: 'DESK', ipAddress: '192.168.1.101', status: 'ONLINE', devices: [
    { id: 'D-001', name: 'Drukarka Faktur', type: 'PRINTER_FISCAL', model: 'Posnet Trio', status: 'OK' }
  ] },
  { id: 'WS-SWI-G1', name: 'Bramka A - Wjazd', orgUnitId: 'UNIT-PORT-SWI', type: 'GATE', ipAddress: '10.0.10.1', status: 'ONLINE', devices: [
    { id: 'D-101', name: 'Skaner LPR', type: 'SCANNER', model: 'Hikvision ANPR', status: 'OK' },
    { id: 'D-102', name: 'Drukarka Biletowa', type: 'PRINTER_TICKET', model: 'Custom TK302', status: 'OK' }
  ] },
  { id: 'WS-POL-REC', name: 'Recepcja Główna', orgUnitId: 'UNIT-SHIP-POL', type: 'DESK', ipAddress: '172.16.1.5', status: 'ONLINE', devices: [
    { id: 'D-301', name: 'Koder Kart RFID', type: 'RFID_ENCODER', model: 'HID OMNIKEY', status: 'OK' },
    { id: 'D-302', name: 'Drukarka Dokumentów', type: 'PRINTER_FISCAL', model: 'Epson TM-T88', status: 'OK' }
  ] }
];
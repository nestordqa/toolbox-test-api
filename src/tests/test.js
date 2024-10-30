// ejemploController.test.js
import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import { filesManagement } from '../controllers/filesController.js';

describe('Files Management Tests 🧪', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // Simulamos el objeto de solicitud
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis() // Permite encadenar métodos
        };
    });

    afterEach(() => {
        sinon.restore(); // Restauramos los stubs y spies después de cada prueba
    });

    it('debería devolver una lista de archivos procesados correctamente 🎸', async () => {
        // Simulamos la respuesta de Axios
        const filesResponse = {
            data: {
                files: ['file1.csv', 'file2.csv']
            }
        };

        const file1Response = {
            data: 'file1.csv,text1,123,#FF5733\nfile1.csv,text2,456,#C70039\n'
        };

        const file2Response = {
            data: 'file2.csv,text3,789,#900C3F\nfile2.csv,text4,invalid,#581845\n'
        };

        sinon.stub(axios, 'get')
            .onFirstCall().resolves(filesResponse) // Primera llamada para obtener archivos
            .onSecondCall().resolves(file1Response) // Segunda llamada para descargar file1
            .onThirdCall().resolves(file2Response); // Tercera llamada para descargar file2

        await filesManagement(req, res);

        expect(res.status.called).to.be.false; // No debería haber llamado a status con error
        expect(res.json.calledOnce).to.be.true; // Debería haber llamado a json una vez
        expect(res.json.firstCall.args[0]).to.deep.equal([
            {
                file: 'file1.csv',
                lines: [
                    { text: 'text1', number: 123, hex: '#FF5733' },
                    { text: 'text2', number: 456, hex: '#C70039' }
                ]
            },
            {
                file: 'file2.csv',
                lines: [
                    { text: 'text3', number: 789, hex: '#900C3F' }
                ]
            }
        ]);
    });

    it('debería devolver un error 404 si no se encuentran archivos 🎸', async () => {
        const filesResponse = {
            data: {
                files: []
            }
        };

        sinon.stub(axios, 'get').resolves(filesResponse);

        await filesManagement(req, res);

        expect(res.status.calledOnce).to.be.true; // Debería haber llamado a status
        expect(res.status.firstCall.args[0]).to.equal(404); // Debería devolver 404
        expect(res.json.calledOnce).to.be.true; // Debería haber llamado a json
        expect(res.json.firstCall.args[0]).to.deep.equal({ message: 'No se encontraron archivos.' });
    });

    it('debería manejar errores al obtener la lista de archivos 🎸', async () => {
        sinon.stub(axios, 'get').rejects(new Error('Error de red'));

        await filesManagement(req, res);

        expect(res.status.calledOnce).to.be.true; // Debería haber llamado a status
        expect(res.status.firstCall.args[0]).to.equal(500); // Debería devolver 500
        expect(res.json.calledOnce).to.be.true; // Debería haber llamado a json
        expect(res.json.firstCall.args[0]).to.deep.equal({ error: 'Error al procesar la solicitud' });
    });

    it('debería manejar errores al descargar un archivo 🎸', async () => {
        const filesResponse = {
            data: {
                files: ['file1.csv']
            }
        };

        sinon.stub(axios, 'get')
            .onFirstCall().resolves(filesResponse) // Respuesta para obtener archivos
            .onSecondCall().rejects(new Error('Error al descargar el archivo')); // Error al descargar

        await filesManagement(req, res);

        expect(res.status.called).to.be.false; // No debería haber llamado a status con error
        expect(res.json.calledOnce).to.be.true; // Debería haber llamado a json
        expect(res.json.firstCall.args[0]).to.deep.equal([]); // Debería devolver un array vacío
    });

    it('debería ignorar archivos sin líneas válidas 🎸', async () => {
        const filesResponse = {
            data: {
                files: ['file1.csv']
            }
        };

        const file1Response = {
            data: 'file1.csv,text1,invalid,#FF5733\nfile1.csv,text2,invalid,#C70039\n'
        };

        sinon.stub(axios, 'get')
            .onFirstCall().resolves(filesResponse) // Respuesta para obtener archivos
            .onSecondCall().resolves(file1Response); // Respuesta para descargar file1

        await filesManagement(req, res);

        expect(res.status.called).to.be.false; // No debería haber llamado a status con error
        expect(res.json.calledOnce).to.be.true; // Debería haber llamado a json
        expect(res.json.firstCall.args[0]).to.deep.equal([]); // Debería devolver un array vacío
    });

    it('debería procesar correctamente archivos con líneas inválidas y válidas 🎸', async () => {
        const filesResponse = {
            data: {
                files: ['file1.csv']
            }
        };

        const file1Response = {
            data: 'file1.csv,text1,123,#FF5733\nfile1.csv,text2,invalid,#C70039\nfile1.csv,text3,456,#C70039\n'
        };

        sinon.stub(axios, 'get')
            .onFirstCall().resolves(filesResponse) // Respuesta para obtener archivos
            .onSecondCall().resolves(file1Response); // Respuesta para descargar file1

        await filesManagement(req, res);

        expect(res.status.called).to.be.false; // No debería haber llamado a status con error
        expect(res.json.calledOnce).to.be.true; // Debería haber llamado a json
        expect(res.json.firstCall.args[0]).to.deep.equal([
            {
                file: 'file1.csv',
                lines: [
                    { text: 'text1', number: 123, hex: '#FF5733' },
                    { text: 'text3', number: 456, hex: '#C70039' }
                ]
            }
        ]); // Debería devolver solo las líneas válidas
    });

    it('debería registrar un error en la consola si hay un problema con una línea 🎸', async () => {
        const filesResponse = {
            data: {
                files: ['file1.csv']
            }
        };

        const file1Response = {
            data: 'file1.csv,text1,123,#FF5733\nfile1.csv,text2,invalid,#C70039\n'
        };

        sinon.stub(axios, 'get')
            .onFirstCall().resolves(filesResponse) // Respuesta para obtener archivos
            .onSecondCall().resolves(file1Response); // Respuesta para descargar file1

        const consoleSpy = sinon.spy(console, 'error'); // Espía en console.error

        await filesManagement(req, res);

        expect(consoleSpy.called).to.be.true; // Debería haber llamado a console.error
        expect(consoleSpy.firstCall.args[0]).to.include('Error en línea:'); // Mensaje de error esperado

        consoleSpy.restore(); // Restaurar el espía
    });
});
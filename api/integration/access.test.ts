import { Chance } from "chance";
import { expect } from "chai";
import express from "express";
import { describe, it } from "mocha";
import sinon from "sinon";
import supertest from "supertest";
import { Container } from "typedi";
import "reflect-metadata";

import { SheetsRepository } from "../src/repositories/sheets.repository.js";
import { router } from "../src/router.js";

const chance = new Chance();

const app = supertest(express().use(router));

const mockMediaCode = () => chance.integer({min: 0, max: 0xffffffff}).toString(16).padStart(8, "0");
const mockLocationCode = () => chance.company().toLowerCase().replaceAll(/[ '.]/g, "");

describe("[API] /access", () => {
    describe("[Endpoint] POST /access", () => {

        const mediaCode1 = mockMediaCode();
        const mediaCode2 = mockMediaCode();
        const mediaCode3 = mockMediaCode();
        const locationCode = mockLocationCode();

        before(async () => {
            const sheetsRepository = Container.get(SheetsRepository);
            sinon.stub((sheetsRepository as any), "refreshAccessTable").resolves();
            sinon.stub((sheetsRepository as any), "accessCache").value({
                [mediaCode1]: [locationCode],
                [mediaCode2]: [],
            });
        });

        after(() => {
            sinon.restore();
        });

        context("media has access", () => {

            it("allows access for media", async () => {
                const result = await app
                    .post(`/api/access/${mediaCode1}`)
                    .set("x-location-code", locationCode)
                    .send()

                expect(result).to.exist;
                expect(result.status).to.equal(200);
                expect(result.body).to.equal(true);
            });
        });

        context("media does not have access", () => {

            it("rejects access for media", async () => {
                const result = await app
                    .post(`/api/access/${mediaCode2}`)
                    .set("x-location-code", locationCode)
                    .send()

                expect(result).to.exist;
                expect(result.status).to.equal(401);
                expect(result.body).to.equal(false);
            });
        });

        context("media does not exist", () => {

            it("rejects access for media", async () => {
                const result = await app
                    .post(`/api/access/${mediaCode3}`)
                    .set("x-location-code", locationCode)
                    .send()

                expect(result).to.exist;
                expect(result.status).to.equal(401);
                expect(result.body).to.equal(false);
            });
        });
    });
});

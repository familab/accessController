import supertest from "supertest";
import { Container } from "typedi";
import { DataSource } from "typeorm";
import { Chance } from "chance";
import { expect } from "chai";
import { describe, it } from "mocha";
import express from "express";
import sinon from "sinon";
import "reflect-metadata";

import { UserStatusEnum } from "../src/enums/user-status.enum.js";
import { LocationDatabaseModel, MediaDatabaseModel, UserDatabaseModel } from "../src/models/database/index.js";
import { SheetsRepository, UserRepository } from "../src/repositories/index.js";
import { router } from "../src/router.js";

const chance = new Chance();

const app = supertest(express().use(router));

const mockMediaCode = () => chance.integer({min: 0, max: 0xffffffff}).toString(16).padStart(8, "0");
const mockLocationCode = () => chance.company().toLowerCase().replaceAll(/[ '.]/g, "");

const userRepo = Container.get(UserRepository);
const mediaRepo = Container.get(DataSource).getRepository(MediaDatabaseModel);
const locationRepo = Container.get(DataSource).getRepository(LocationDatabaseModel);

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
    describe.skip("[Endpoint] POST /access", () => {

        let user1: UserDatabaseModel;
        let user2: UserDatabaseModel;
        let media1: MediaDatabaseModel;
        let media2: MediaDatabaseModel;
        let location: LocationDatabaseModel;

        before(async () => {

            user1 = await userRepo.saveUser({
                id: undefined,
                name: chance.name(),
                status: UserStatusEnum.ACTIVE,
                locationsCanAccess: []
            });

            user2 = await userRepo.saveUser({
                id: undefined,
                name: chance.name(),
                status: UserStatusEnum.ACTIVE,
                locationsCanAccess: []
            });

            media1 = await mediaRepo.save({
                code: chance.string({length: 20, alpha: true}),
                user: user1,
                status: "ACTIVE"
            });

            media2 = await mediaRepo.save({
                code: chance.string({length: 20, alpha: true}),
                user: user2,
                status: "ACTIVE"
            });

            const description = chance.company()
            location = await locationRepo.save({
                code: description.toLowerCase().replaceAll(" ", "-") + "-front-door",
                description,
            });

            await userRepo.addUserLocationAccess(user1.id, location.id);
        });

        after(async () => {
            await mediaRepo.remove(media1);
            await userRepo.delete(user1);
            await locationRepo.remove(location);
        });

        context("user has access", () => {

            it("allows access for user", async () => {
                const result = await app
                    .post(`/api/access/${media1.code}`)
                    .set("x-location-code", `${location.code}`)
                    .send()

                expect(result).to.exist;
                expect(result.status).to.equal(200);
                expect(result.body).to.equal(true);
            });
        });

        context("user does not have access", () => {

            it("rejects access for user", async () => {
                const result = await app
                    .post(`/api/access/${media2.code}`)
                    .set("x-location-code", `${location.code}`)
                    .send()

                expect(result).to.exist;
                expect(result.status).to.equal(401);
                expect(result.body).to.equal(false);
            });
        });
    });
});

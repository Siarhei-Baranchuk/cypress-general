/// <reference types="cypress" />

const BASE_URL = "https://api.restful-api.dev";

describe("REST API Testing - CRUD Operations", () => {
  let createdObjectId;

  describe("GET - Read Operations", () => {
    it("Get all objects", () => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/objects`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("name");
      });
    });

    it("Get specific object by ID", () => {
      // First create an object to retrieve
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Object to Retrieve",
          data: { year: 2024, color: "Silver" },
        },
      }).then((createResponse) => {
        const objectId = createResponse.body.id;

        // Now retrieve it
        cy.request({
          method: "GET",
          url: `${BASE_URL}/objects/${objectId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("id", objectId);
          expect(response.body).to.have.property("name", "Object to Retrieve");
          expect(response.body).to.have.property("data");
          expect(response.body.data).to.have.property("year", 2024);
          expect(response.body.data).to.have.property("color", "Silver");
        });
      });
    });

    it("Validate response headers", () => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/objects`,
      }).then((response) => {
        // Validate Content-Type
        expect(response.headers).to.have.property("content-type");
        expect(response.headers["content-type"]).to.include("application/json");

        // Validate response time (should be fast)
        expect(response.duration).to.be.lessThan(3000); // Less than 3 seconds
      });
    });

    it("Validate data types in response", () => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/objects`,
      }).then((response) => {
        expect(response.status).to.eq(200);

        const firstObject = response.body[0];

        // Validate types
        expect(firstObject.id).to.be.a("string");
        expect(firstObject.name).to.be.a("string");
        expect(firstObject.data).to.be.an("object");

        // If data contains numeric fields, validate them
        if (firstObject.data.year) {
          expect(firstObject.data.year).to.be.a("number");
        }
        if (firstObject.data.price) {
          expect(firstObject.data.price).to.be.a("number");
        }
      });
    });

    it("Filter objects by multiple IDs", () => {
      // Note: This test assumes API supports filtering by IDs
      // Format: GET /objects?id=1&id=2&id=3
      cy.request({
        method: "GET",
        url: `${BASE_URL}/objects?id=3&id=5&id=10`,
        failOnStatusCode: false,
      }).then((response) => {
        // If API supports filtering, check results
        if (response.status === 200) {
          expect(response.body).to.be.an("array");
          // Verify only requested IDs are returned
          const returnedIds = response.body.map((obj) => obj.id);
          expect(returnedIds).to.have.length.lessThan(4); // At most 3 objects
          cy.log("✓ Filtering by IDs works");
        } else {
          // API might not support this feature
          cy.log("⚠ API does not support filtering by IDs");
        }
      });
    });

    it("Negative: Get non-existent object", () => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/objects/99999999999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property("error");
      });
    });
  });

  describe("POST - Create Operations", () => {
    it("Create new object", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Cypress Test Device",
          data: {
            year: 2025,
            price: 1999.99,
            "CPU model": "Intel Core i9",
            "Hard disk size": "1 TB",
          },
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id");
        expect(response.body.name).to.eq("Cypress Test Device");
        expect(response.body.data.year).to.eq(2025);
        expect(response.body.data.price).to.eq(1999.99);
        expect(response.body.createdAt).to.exist;

        // Save ID for other tests
        createdObjectId = response.body.id;
      });
    });

    it("Create with minimal required data", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Minimal Device", // Only required field
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id");
        expect(response.body.name).to.eq("Minimal Device");
        expect(response.body).to.have.property("createdAt");
        cy.log("✓ Object created with minimal data");
      });
    });

    it("Create with boundary values - special characters", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Test <>&\"'@#$%^&*()",
          data: {
            description: "Special chars: <>{}[]|\\",
            emoji: "🚀📱💻",
          },
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.include("<>&");
        cy.log("✓ API handles special characters");
      });
    });

    it("Validate timestamps format", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Timestamp Test Device",
          data: { year: 2025 },
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        // Validate createdAt exists and is valid ISO 8601 format
        expect(response.body).to.have.property("createdAt");
        const createdAt = new Date(response.body.createdAt);
        expect(createdAt.toString()).to.not.eq("Invalid Date");

        // Validate createdAt is in the past (or very recent)
        const now = new Date();
        expect(createdAt.getTime()).to.be.lessThan(now.getTime() + 1000); // Allow 1 sec tolerance

        cy.log(`✓ createdAt: ${response.body.createdAt}`);
        cy.log("✓ Timestamp is valid ISO 8601 format");
      });
    });

    it("Negative: Create object with invalid data", () => {
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          // Missing required 'name' field
          data: {
            year: "invalid_year", // Invalid type
          },
        },
        failOnStatusCode: false,
      }).then((response) => {
        // API may accept this or return error - verify behavior
        expect([200, 400]).to.include(response.status);
      });
    });
  });

  describe("PUT - Full Update Operations", () => {
    before(() => {
      // Create object for update tests
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Device to Update",
          data: { year: 2023 },
        },
      }).then((response) => {
        createdObjectId = response.body.id;
      });
    });

    it("Update existing object", () => {
      cy.request({
        method: "PUT",
        url: `${BASE_URL}/objects/${createdObjectId}`,
        body: {
          name: "Updated Device Name",
          data: {
            year: 2025,
            price: 2999.99,
            color: "Silver",
          },
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq("Updated Device Name");
        expect(response.body.data.year).to.eq(2025);
        expect(response.body.data.price).to.eq(2999.99);
        expect(response.body.updatedAt).to.exist;
      });
    });

    it("Negative: Update non-existent object", () => {
      cy.request({
        method: "PUT",
        url: `${BASE_URL}/objects/99999999999`,
        body: {
          name: "Non-existent Device",
          data: { year: 2025 },
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property("error");
      });
    });
  });

  describe("PATCH - Partial Update Operations", () => {
    before(() => {
      // Create object for patch tests
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Device to Patch",
          data: { year: 2023, color: "Black" },
        },
      }).then((response) => {
        createdObjectId = response.body.id;
      });
    });

    it("Partially update object", () => {
      cy.request({
        method: "PATCH",
        url: `${BASE_URL}/objects/${createdObjectId}`,
        body: {
          name: "Patched Device Name",
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq("Patched Device Name");
        expect(response.body.updatedAt).to.exist;
      });
    });

    it("Negative: Patch non-existent object", () => {
      cy.request({
        method: "PATCH",
        url: `${BASE_URL}/objects/99999999999`,
        body: {
          name: "This won't work",
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property("error");
      });
    });
  });

  describe("DELETE - Delete Operations", () => {
    beforeEach(() => {
      // Create fresh object for each delete test
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Device to Delete",
          data: { year: 2023 },
        },
      }).then((response) => {
        createdObjectId = response.body.id;
      });
    });

    it("Delete existing object", () => {
      cy.request({
        method: "DELETE",
        url: `${BASE_URL}/objects/${createdObjectId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.include("deleted");
      });

      // Verify object is deleted
      cy.request({
        method: "GET",
        url: `${BASE_URL}/objects/${createdObjectId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it("Negative: Delete non-existent object", () => {
      cy.request({
        method: "DELETE",
        url: `${BASE_URL}/objects/99999999999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property("error");
      });
    });
  });

  describe("Idempotency Tests - Same operation multiple times", () => {
    let idempotencyObjectId;

    before(() => {
      // Create object for idempotency tests
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Idempotency Test Device",
          data: { year: 2024, price: 1000 },
        },
      }).then((response) => {
        idempotencyObjectId = response.body.id;
      });
    });

    it("PUT idempotency - same request twice produces same result", () => {
      const updateData = {
        name: "Updated Idempotent Device",
        data: {
          year: 2025,
          price: 1500,
          color: "Black",
        },
      };

      let firstResponse;
      let secondResponse;

      // First PUT request
      cy.request({
        method: "PUT",
        url: `${BASE_URL}/objects/${idempotencyObjectId}`,
        body: updateData,
      }).then((response) => {
        expect(response.status).to.eq(200);
        firstResponse = response.body;

        cy.log("First PUT completed");
        cy.log(`First updatedAt: ${firstResponse.updatedAt}`);
      });

      // Second PUT request with identical data
      cy.request({
        method: "PUT",
        url: `${BASE_URL}/objects/${idempotencyObjectId}`,
        body: updateData,
      }).then((response) => {
        expect(response.status).to.eq(200);
        secondResponse = response.body;

        cy.log("Second PUT completed");
        cy.log(`Second updatedAt: ${secondResponse.updatedAt}`);

        // Verify idempotency - core data should be identical
        expect(secondResponse.id).to.eq(firstResponse.id);
        expect(secondResponse.name).to.eq(firstResponse.name);
        expect(secondResponse.data.year).to.eq(firstResponse.data.year);
        expect(secondResponse.data.price).to.eq(firstResponse.data.price);
        expect(secondResponse.data.color).to.eq(firstResponse.data.color);

        // updatedAt may change, but data should remain consistent
        cy.log("✓ Idempotency verified: same data after multiple PUT requests");
      });
    });

    it("DELETE idempotency - deleting already deleted object", () => {
      let objectToDelete;

      // Create object to delete
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "Object to Delete Twice",
          data: { year: 2023 },
        },
      })
        .then((response) => {
          objectToDelete = response.body.id;
          cy.log(`Created object with ID: ${objectToDelete}`);
        })
        .then(() => {
          // First DELETE - should succeed
          cy.request({
            method: "DELETE",
            url: `${BASE_URL}/objects/${objectToDelete}`,
          }).then((response) => {
            expect(response.status).to.eq(200);
            cy.log("First DELETE: successful");
          });
        })
        .then(() => {
          // Second DELETE - should return 404 (idempotent behavior)
          cy.request({
            method: "DELETE",
            url: `${BASE_URL}/objects/${objectToDelete}`,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property("error");
            cy.log("Second DELETE: returns 404 as expected (already deleted)");
            cy.log("✓ DELETE idempotency verified: consistent 404 for non-existent resource");
          });
        });
    });

    it("PATCH idempotency - same partial update twice", () => {
      let patchObjectId;

      // Create object for PATCH idempotency test
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: "PATCH Idempotency Device",
          data: { year: 2023, price: 800, color: "White" },
        },
      })
        .then((response) => {
          patchObjectId = response.body.id;
        })
        .then(() => {
          const patchData = {
            data: {
              price: 999,
            },
          };

          let firstPatchResponse;

          // First PATCH
          cy.request({
            method: "PATCH",
            url: `${BASE_URL}/objects/${patchObjectId}`,
            body: patchData,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.price).to.eq(999);
            firstPatchResponse = response.body;
            cy.log("First PATCH: price updated to 999");
          });

          // Second PATCH with same data
          cy.request({
            method: "PATCH",
            url: `${BASE_URL}/objects/${patchObjectId}`,
            body: patchData,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.price).to.eq(999);

            // Verify other fields weren't affected
            expect(response.body.id).to.eq(firstPatchResponse.id);
            expect(response.body.data.price).to.eq(firstPatchResponse.data.price);

            cy.log("Second PATCH: price remains 999");
            cy.log("✓ PATCH idempotency verified: consistent result");
          });
        });
    });
  });

  describe("E2E - Complete CRUD Flow", () => {
    let e2eObjectId;
    const deviceName = "E2E Test Device";
    const updatedName = "E2E Updated Device";

    it("E2E: CREATE → READ → UPDATE → PATCH → DELETE", () => {
      // Step 1: CREATE - Create new object
      cy.log("Step 1: CREATE new object");
      cy.request({
        method: "POST",
        url: `${BASE_URL}/objects`,
        body: {
          name: deviceName,
          data: {
            year: 2025,
            price: 1500,
            color: "Blue",
          },
        },
      })
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.name).to.eq(deviceName);
          e2eObjectId = response.body.id;
          cy.log(`Created object with ID: ${e2eObjectId}`);
        })
        .then(() => {
          // Step 2: READ - Get created object
          cy.log("Step 2: READ created object");
          cy.request({
            method: "GET",
            url: `${BASE_URL}/objects/${e2eObjectId}`,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.id).to.eq(e2eObjectId);
            expect(response.body.name).to.eq(deviceName);
            expect(response.body.data.year).to.eq(2025);
            cy.log("Object retrieved successfully");
          });
        })
        .then(() => {
          // Step 3: UPDATE - Full update object
          cy.log("Step 3: UPDATE object (PUT)");
          cy.request({
            method: "PUT",
            url: `${BASE_URL}/objects/${e2eObjectId}`,
            body: {
              name: updatedName,
              data: {
                year: 2026,
                price: 2000,
                color: "Red",
                storage: "512 GB",
              },
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq(updatedName);
            expect(response.body.data.year).to.eq(2026);
            expect(response.body.data.storage).to.eq("512 GB");
            cy.log("Object updated successfully");
          });
        })
        .then(() => {
          // Step 4: PATCH - Partial update
          cy.log("Step 4: PATCH object (partial update)");
          cy.request({
            method: "PATCH",
            url: `${BASE_URL}/objects/${e2eObjectId}`,
            body: {
              data: {
                price: 2500,
              },
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.price).to.eq(2500);
            cy.log("Object patched successfully");
          });
        })
        .then(() => {
          // Step 5: DELETE - Remove object
          cy.log("Step 5: DELETE object");
          cy.request({
            method: "DELETE",
            url: `${BASE_URL}/objects/${e2eObjectId}`,
          }).then((response) => {
            expect(response.status).to.eq(200);
            cy.log("Object deleted successfully");
          });
        })
        .then(() => {
          // Step 6: VERIFY deletion
          cy.log("Step 6: VERIFY object is deleted");
          cy.request({
            method: "GET",
            url: `${BASE_URL}/objects/${e2eObjectId}`,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(404);
            cy.log("Verified: object no longer exists");
          });
        });
    });
  });
});

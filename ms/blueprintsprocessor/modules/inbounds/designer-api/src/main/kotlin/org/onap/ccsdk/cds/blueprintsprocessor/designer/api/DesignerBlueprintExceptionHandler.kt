/*
 * Copyright © 2018-2019 Bell Canada Intellectual Property.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.onap.ccsdk.cds.blueprintsprocessor.designer.api

import org.onap.ccsdk.cds.controllerblueprints.core.BluePrintException
import org.onap.ccsdk.cds.controllerblueprints.core.data.ErrorCode
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/**
 * ControllerBlueprintExceptionHandler Purpose: Handle exceptions in controllerBlueprint API and provide the right
 * HTTP code status
 *
 * @author Vinal Patel
 * @version 1.0
 */
@RestControllerAdvice("org.onap.ccsdk.cds.controllerblueprints")
open class DesignerBlueprintExceptionHandler {

    companion object ControllerBlueprintExceptionHandler {
        val LOG = LoggerFactory.getLogger(DesignerBlueprintExceptionHandler::class.java)
    }

    @ExceptionHandler
    fun ControllerBlueprintExceptionHandler(e: BluePrintException): ResponseEntity<ErrorMessage> {
        val errorCode = ErrorCode.valueOf(e.code)
        val errorMessage = ErrorMessage(errorCode?.message(e.message!!), errorCode?.value, "ControllerBluePrint_Error_Message")
        LOG.error("Error: $errorCode ${e.message}")
        return ResponseEntity(errorMessage, HttpStatus.resolve(errorCode!!.httpCode))
    }

    @ExceptionHandler
    fun ControllerBlueprintExceptionHandler(e: Exception): ResponseEntity<ErrorMessage> {
        val errorCode = ErrorCode.GENERIC_FAILURE
        val errorMessage = ErrorMessage(errorCode?.message(e.message!!), errorCode?.value, "ControllerBluePrint_Error_Message")
        LOG.error("Error: $errorCode ${e.message}")
        return ResponseEntity(errorMessage, HttpStatus.resolve(errorCode!!.httpCode))
    }
}

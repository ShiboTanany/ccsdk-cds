/*
 * Copyright © 2017-2018 AT&T Intellectual Property.
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

package org.onap.ccsdk.cds.controllerblueprints.core.service

import org.onap.ccsdk.cds.controllerblueprints.core.BluePrintConstants
import org.onap.ccsdk.cds.controllerblueprints.core.BluePrintException
import org.onap.ccsdk.cds.controllerblueprints.core.data.ArtifactType
import org.onap.ccsdk.cds.controllerblueprints.core.data.CapabilityDefinition
import org.onap.ccsdk.cds.controllerblueprints.core.data.DataType
import org.onap.ccsdk.cds.controllerblueprints.core.data.NodeType
import org.onap.ccsdk.cds.controllerblueprints.core.data.RelationshipType
import org.onap.ccsdk.cds.controllerblueprints.core.interfaces.BluePrintRepoService
import org.onap.ccsdk.cds.controllerblueprints.core.utils.JacksonUtils
import org.slf4j.LoggerFactory

open class BluePrintRepoFileService(modelTypePath: String) : BluePrintRepoService {

    private val log = LoggerFactory.getLogger(BluePrintRepoFileService::class.toString())

    private val dataTypePath = modelTypePath.plus(BluePrintConstants.PATH_DIVIDER).plus(BluePrintConstants.MODEL_DEFINITION_TYPE_DATA_TYPE)
    private val nodeTypePath = modelTypePath.plus(BluePrintConstants.PATH_DIVIDER).plus(BluePrintConstants.MODEL_DEFINITION_TYPE_NODE_TYPE)
    private val artifactTypePath = modelTypePath.plus(BluePrintConstants.PATH_DIVIDER).plus(BluePrintConstants.MODEL_DEFINITION_TYPE_ARTIFACT_TYPE)
    private val capabilityTypePath =
        modelTypePath.plus(BluePrintConstants.PATH_DIVIDER).plus(BluePrintConstants.MODEL_DEFINITION_TYPE_CAPABILITY_TYPE)
    private val relationshipTypePath =
        modelTypePath.plus(BluePrintConstants.PATH_DIVIDER).plus(BluePrintConstants.MODEL_DEFINITION_TYPE_RELATIONSHIP_TYPE)
    private val extension = ".json"

    override fun getDataType(dataTypeName: String): DataType {
        val fileName = dataTypePath.plus(BluePrintConstants.PATH_DIVIDER)
            .plus(dataTypeName).plus(extension)
        return getModelType(fileName, DataType::class.java)
    }

    override fun getNodeType(nodeTypeName: String): NodeType {
        val fileName = nodeTypePath.plus(BluePrintConstants.PATH_DIVIDER).plus(nodeTypeName).plus(extension)
        return getModelType(fileName, NodeType::class.java)
    }

    override fun getArtifactType(artifactTypeName: String): ArtifactType {
        val fileName = artifactTypePath.plus(BluePrintConstants.PATH_DIVIDER)
            .plus(artifactTypeName).plus(extension)
        return getModelType(fileName, ArtifactType::class.java)
    }

    override fun getRelationshipType(relationshipTypeName: String): RelationshipType {
        val fileName = relationshipTypePath.plus(BluePrintConstants.PATH_DIVIDER)
            .plus(relationshipTypeName).plus(extension)
        return getModelType(fileName, RelationshipType::class.java)
    }

    override fun getCapabilityDefinition(capabilityDefinitionName: String): CapabilityDefinition {
        val fileName = capabilityTypePath.plus(BluePrintConstants.PATH_DIVIDER)
            .plus(capabilityDefinitionName).plus(extension)
        return getModelType(fileName, CapabilityDefinition::class.java)
    }

    private fun <T> getModelType(fileName: String, valueType: Class<T>): T {
        return JacksonUtils.readValueFromFile(fileName, valueType)
            ?: throw BluePrintException("couldn't get file($fileName) for type(${valueType.name}")
    }
}

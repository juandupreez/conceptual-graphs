# Conceptual Graphs

[Conceptual Graphs](https://en.wikipedia.org/wiki/Conceptual_graph) are a formalism for knowledge representation. This npm module hopes to break conceptual graph theory down into managable objects that programmers can play with to explore the world of concepts via graphical notation.

Below is an example of a conceptual graph of a beloved cartoon "Tom and Jerry."

![Image](https://juandupreez.github.io/images/TomAndJerryCG.PNG)

---

<!-- ## Getting Started

1. Initialize Your Own repo

```
npm init
```

2. Download conceptual-graphs

```
npm i conceptual-graphs
```

--- -->

## Basics

Conceptual Graphs are composed of 2 kinds of nodes: Concept nodes and Relation nodes. A concept node is composed of a Concept Type and a referent which gives meaning to the Concept Type.

### Vocabluary: Concept Type Hierarchy

![Image](https://juandupreez.github.io/images/TomAndJerryConceptTypes.PNG)

```
ConceptType {
    id: string;
    label: string;
    parentConceptTypeLabels: string[];
    subConceptTypeLabels: string[];
}
```
Concept Types are abstract classes/groups of different kinds of concepts. They are usually arranged in a hierarchical (or partially ordered) graph where the top elements are more general than those below.

### Relation Types
### Concepts
### Relations
### Conceptual Graph

---

## Advanced Usage
### Queries
### Rules

---

## Database Integration
### In-Memory Database
### Neo4J


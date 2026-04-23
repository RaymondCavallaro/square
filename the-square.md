# **The Square**

## **Current Prototype Framing**

The current browser prototype should be read as an **early claim-based coordination system**.

It still uses lighter terminology in parts of the code and UI, but Phase 1 treats the current model as a reduced bridge toward the fuller orientation:

* declaration -> early claim
* resolution intent -> resolution proposal
* committed weight -> exposed commitment
* activity log -> early memory trail

This document therefore describes the direction the prototype is moving toward, while the running app still exposes only a simplified first slice of that shape.

## **Core Principle**

The Square is a coordination system where:

> **needs are declared, work is resolved, and value flows through visible commitment.**

It replaces abstract exchange with **real obligation tied to real outcomes**.

---

## **1. Weight**

### **Definition**

**Weight = obligation capacity**

It represents how much responsibility a person can take on within the system.

---

### **Properties**

* **Earned** through completed resolutions
* **Spent (locked)** when declaring needs
* **Transferred** when work is completed
* **Not accumulated for its own sake** — used to acquire real outcomes

---

### **States**

* **Free Weight** → available to declare
* **Locked Weight** → committed to a declaration

---

### **Constraints**

* Weight must be **backed by reality**:

  * completed work (primary)
  * standing (trusted backing, later layer)
  * land (foundational, later layer)

* A user cannot declare beyond their available weight

---

### **Purpose**

Weight is not currency.

> It is the system’s measure of **how much obligation you can responsibly create and resolve**.

---

## **2. Core Loop**

1. A user **declares a need**
2. Weight is **locked** into the declaration
3. Others **choose to resolve**
4. Work is performed
5. Weight transfers to the resolver
6. Resolver uses weight to **clear their own needs**

---

## **3. Declarations**

### **Definition**

At the current prototype stage, a declaration is best understood as an **early claim**:

> a committed need, backed by locked weight, but not yet carrying the full claim structure that later phases will add.

---

### **Lifecycle**

* **Draft**

  * private
  * no weight locked

* **Committed**

  * weight locked
  * visible to resolvers

* **Active / In Progress**

  * resolver engaged

* **Resolved**

  * completed and cleared

---

### **Rules**

* Declaring requires **immediate weight locking**
* Cannot declare beyond available weight
* Cannot freely cancel once resolution intent exists

---

### **Visibility Tiers**

* **Draft** → private
* **Committed** → visible to resolvers
* **Prioritized** → high visibility (based on weight / engagement)

---

### **Maintenance Pressure**

Declarations do not decay or expire automatically.

Instead:

> **Visibility requires activity**

To maintain priority, the declarer must:

* adjust weight
* refine terms
* respond to interest
* reaffirm commitment

Inactive declarations remain valid but lose visibility.

---

### **Structure**

Declarations are:

* **simple at creation**
* **progressively structured when needed**

Structure emerges through:

* system prompts
* resolver interaction
* negotiation

---

## **4. Resolution**

### **Definition**

Resolution is the act of **fulfilling a declaration**.

---

### **Flow**

1. Resolver selects a declaration
2. Submits **resolution intent** (the current simplified form of a resolution proposal)
3. Declaration becomes **soft-locked**
4. Terms are **negotiated and refined**
5. Work is performed
6. Declaration is completed
7. Weight transfers to resolver

---

### **Properties**

* Multiple resolvers may compete
* Declarer may:

  * select one resolver
  * allow competition (“first to deliver”)

---

### **Outcome**

* Resolver gains weight
* Declarer clears their need

---

## **5. Standing (Backing)** *(partial layer)*

### **Definition**

Standing is **weight placed behind a person instead of a declaration**.

It represents **trust in their future actions**.

---

### **Properties**

* Increases a person’s effective capacity
* Is **voluntary and reversible (with constraints later)**
* Carries **risk for the backer**

---

### **Purpose**

* Enables acceleration of progress
* Creates trust networks
* Allows uneven advancement (intentionally)

---

## **6. Visibility & Reputation**

The system does not enforce behavior automatically.

Instead:

> **All relevant history is visible**

Profiles expose patterns such as:

* completion rate
* abandonment rate
* delays
* disputes
* past commitments

---

### **Philosophy**

* No hidden penalties
* No algorithmic punishment

> **People decide who to trust**

---

## **7. Rules (Behavior System)**

### **Definition**

Rules are:

> **Resolvable declarations about behavior**

They are not imposed globally.

They are **negotiated conditions**, backed by weight.

---

### **Usage**

Rules can be attached to:

* declarations
* resolutions
* conflicts

---

## **Prototype Boundary**

The current repository does **not** yet implement the full claim structure described above.

What it already has:

* early claims through declarations
* visible commitment through weight
* lightweight proposal/acceptance flow
* a first memory trail through activity history

What later phases still need:

* explicit context fields
* evaluation surface structure
* richer negotiation and outcomes
* structured memory and claim relations

Examples:

* “+20 weight if this condition is accepted”
* “I will not proceed unless this rule applies”
* “Lower cost if this standard is followed”

---

### **Levels of Emergence**

#### **1. Local**

Applies only to a specific interaction

#### **2. Cluster**

Adopted repeatedly by a group

#### **3. System-wide**

Becomes common through widespread use

---

### **System Role**

The system surfaces:

* what each party proposes
* commonly used rules in similar cases
* past behavior of participants

---

### **Enforcement**

There is no central enforcement.

Rules are enforced through:

* participation
* weight decisions
* reputation
* conflict escalation

---

## **8. Conflict (Early Form)**

Conflicts arise when participants disagree on:

* outcomes
* behavior
* rule interpretation

---

### **Current State**

* Conflicts are declared similarly to needs
* Others can observe and take positions
* Weight gathers around different sides

---

### **Purpose**

* Surface disagreements
* Allow social and weight-based resolution
* Form the basis of a future legal system

---

## **9. Contributions**

Users may direct unused or excess weight toward:

* shared efforts
* collective support
* system-level initiatives

If not directed:

* weight may flow into **self-standing over time** (with cost)

---

## **10. System Philosophy**

The Square operates on:

### **Transparency over enforcement**

All actions are visible

### **Commitment over abstraction**

Everything is tied to real outcomes

### **Social trust over centralized authority**

People decide who to engage with

### **Cost on every action**

No free declarations, no free influence

---

## **11. What is Not Yet Defined**

The following systems are incomplete or not yet formalized:

* Land (citizenship and base capacity)
* Standing constraints and risks
* Failure consequences (severity levels)
* Conflict resolution authority
* System-wide rule stabilization

---

## **Summary**

> The Square is a system where coordination emerges from visible commitments,
> and order is formed through negotiated rules backed by real stakes.
